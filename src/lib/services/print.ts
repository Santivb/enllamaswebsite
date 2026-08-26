import { renderTicketText, type EmailInquiry } from "./email";

const PRINTNODE_API = "https://api.printnode.com/printjobs";

/** Give up rather than hold a webhook open if PrintNode is slow or down. */
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Blank lines appended after the ticket so it clears the tear bar and the
 * operator can rip it off cleanly. The TM-U220B's autocutter is driven by
 * ESC/POS control codes we deliberately aren't sending yet — plain text plus
 * a paper feed is enough to get a readable ticket out of the printer for the
 * owner's first live test. Tune this (or add a cut command) after that test.
 */
const TRAILING_FEED = "\n".repeat(6);

export class PrintNotConfiguredError extends Error {
  constructor() {
    super(
      "Receipt printing isn't configured yet. Set PRINTNODE_API_KEY and " +
        "PRINTNODE_PRINTER_ID in .env.local — see .env.example."
    );
    this.name = "PrintNotConfiguredError";
  }
}

type PrintNodeConfig = { apiKey: string; printerId: number };

/**
 * Reads and validates the PrintNode credentials.
 *
 * Returns null (rather than throwing) when nothing is set, so callers can
 * treat "no printer configured yet" as an ordinary skip instead of an error —
 * which is the state this project is in until the owner creates the account.
 */
function readConfig(): PrintNodeConfig | null {
  const apiKey = process.env.PRINTNODE_API_KEY;
  const rawPrinterId = process.env.PRINTNODE_PRINTER_ID;
  if (!apiKey || !rawPrinterId) return null;

  const printerId = Number(rawPrinterId);
  if (!Number.isInteger(printerId) || printerId <= 0) {
    // Misconfigured rather than unconfigured — worth a loud log, because the
    // owner will have pasted something here and expects tickets to print.
    console.error(
      `PRINTNODE_PRINTER_ID must be a positive integer, got: ${rawPrinterId}`
    );
    return null;
  }
  return { apiKey, printerId };
}

export function isPrintConfigured(): boolean {
  return readConfig() !== null;
}

/**
 * Sends a kitchen ticket to the restaurant's receipt printer via PrintNode.
 *
 * The job is submitted as `raw_base64` — PrintNode hands the bytes straight to
 * the printer with no driver in between, which is what an ESC/POS receipt
 * printer like the Epson TM-U220B wants. The content is the same monospace
 * ticket the email carries (see renderTicketText in ./email).
 *
 * Throws PrintNotConfiguredError if no credentials are set, and a plain Error
 * if PrintNode rejects the job. Callers are expected to catch both — printing
 * must never be able to take down the order flow.
 */
export async function sendTicketToPrinter(inquiry: EmailInquiry): Promise<number> {
  const config = readConfig();
  if (!config) throw new PrintNotConfiguredError();

  const content = Buffer.from(
    renderTicketText(inquiry) + TRAILING_FEED,
    "utf8"
  ).toString("base64");

  // PrintNode uses HTTP Basic auth with the API key as the username and an
  // empty password.
  const auth = Buffer.from(`${config.apiKey}:`, "utf8").toString("base64");

  let response: Response;
  try {
    response = await fetch(PRINTNODE_API, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        printerId: config.printerId,
        title: `En Llamas 87 — ${inquiry.name}`,
        contentType: "raw_base64",
        content,
        source: "En Llamas 87 website",
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    throw new Error(`PrintNode request failed: ${(err as Error).message}`);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `PrintNode rejected the job (HTTP ${response.status}): ${detail.slice(0, 300)}`
    );
  }

  // A successful submission returns the new print job's numeric id. Worth
  // returning so the caller can log it — it's the handle you quote to
  // PrintNode support when a ticket doesn't come out.
  const jobId = await response.json().catch(() => null);
  return typeof jobId === "number" ? jobId : -1;
}
