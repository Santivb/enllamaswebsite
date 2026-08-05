import { Resend } from "resend";
import nodemailer from "nodemailer";
import { businessConfig } from "@/config/business";

export type InquiryType = "general" | "catering" | "bulk-order" | "order";

export type EmailInquiry = {
  type: InquiryType;
  name: string;
  email: string;
  phone?: string;
  message: string;
  /** Extra structured fields (party size, date, time, etc.) rendered as a list. */
  details?: Record<string, string>;
};

const INQUIRY_LABELS: Record<InquiryType, string> = {
  general: "General Contact",
  catering: "Special Order / Catering Request",
  "bulk-order": "Bulk Order",
  order: "Online Order",
};

export class EmailNotConfiguredError extends Error {
  constructor() {
    super(
      "Email sending isn't configured yet. Set GMAIL_USER + " +
        "GMAIL_APP_PASSWORD (or RESEND_API_KEY) and CONTACT_FORM_RECIPIENT_EMAIL " +
        "in .env.local — see .env.example."
    );
    this.name = "EmailNotConfiguredError";
  }
}

/**
 * Sends a customer inquiry to the restaurant's inbox.
 *
 * Tries Resend first (if RESEND_API_KEY is set), then falls back to sending
 * straight through Gmail's SMTP servers using GMAIL_USER + GMAIL_APP_PASSWORD
 * — no third-party account needed beyond the Gmail address already in use.
 */
export async function sendInquiryEmail(inquiry: EmailInquiry): Promise<void> {
  const to = process.env.CONTACT_FORM_RECIPIENT_EMAIL || businessConfig.email;
  const resendKey = process.env.RESEND_API_KEY;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

  if (!to || (!resendKey && !(gmailUser && gmailPassword))) {
    throw new EmailNotConfiguredError();
  }

  const label = INQUIRY_LABELS[inquiry.type];
  const submittedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const subject = `[${label}] New inquiry from ${inquiry.name}`;
  const text = buildTicketText(inquiry, label, submittedAt);
  const html = buildTicketHtml(inquiry, label, submittedAt);

  if (resendKey) {
    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      // TODO: verify a sending domain in Resend and use an address on it
      // (e.g. "En Llamas 87 <inquiries@enllamas87.com>") instead of the
      // shared onboarding sender.
      from: "En Llamas 87 Website <onboarding@resend.dev>",
      to,
      replyTo: inquiry.email,
      subject,
      // Both bodies are laid out like a narrow kitchen/receipt ticket (dashed
      // rules, monospace, all-caps labels) so this prints cleanly whether it's
      // opened in an email client and printed, or forwarded to a receipt printer.
      text,
      html,
    });

    if (error) {
      throw new Error(`Resend failed to send: ${error.message}`);
    }
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPassword },
  });

  await transporter.sendMail({
    from: `En Llamas 87 Website <${gmailUser}>`,
    to,
    replyTo: inquiry.email,
    subject,
    text,
    html,
  });
}

const TICKET_WIDTH = 32;
const RULE = "-".repeat(TICKET_WIDTH);

function buildTicketText(
  inquiry: EmailInquiry,
  label: string,
  submittedAt: string
): string {
  const lines = [
    "EN LLAMAS 87",
    label.toUpperCase(),
    submittedAt,
    RULE,
    `NAME:  ${inquiry.name}`,
    `PHONE: ${inquiry.phone || "-"}`,
    `EMAIL: ${inquiry.email}`,
  ];

  if (inquiry.details) {
    lines.push(RULE);
    for (const [key, value] of Object.entries(inquiry.details)) {
      lines.push(`${key.toUpperCase()}: ${value}`);
    }
  }

  lines.push(RULE, "MESSAGE:", inquiry.message, RULE, "*** END OF TICKET ***");

  return lines.join("\n");
}

function buildTicketHtml(
  inquiry: EmailInquiry,
  label: string,
  submittedAt: string
): string {
  const detailRows = inquiry.details
    ? Object.entries(inquiry.details)
        .map(
          ([key, value]) =>
            `<div style="margin:4px 0;"><strong>${key.toUpperCase()}:</strong> ${value}</div>`
        )
        .join("")
    : "";

  return `
    <div style="font-family:'Courier New',Courier,monospace;max-width:340px;margin:0 auto;padding:20px;color:#111;background:#fff;font-size:14px;line-height:1.5;">
      <div style="text-align:center;border-bottom:2px dashed #111;padding-bottom:10px;margin-bottom:10px;">
        <div style="font-size:16px;font-weight:bold;letter-spacing:2px;">EN LLAMAS 87</div>
        <div style="font-size:12px;font-weight:bold;">${label.toUpperCase()}</div>
        <div style="font-size:11px;">${submittedAt}</div>
      </div>
      <div style="margin:4px 0;"><strong>NAME:</strong> ${inquiry.name}</div>
      <div style="margin:4px 0;"><strong>PHONE:</strong> ${inquiry.phone || "-"}</div>
      <div style="margin:4px 0;"><strong>EMAIL:</strong> ${inquiry.email}</div>
      ${
        detailRows
          ? `<div style="border-top:1px dashed #111;margin-top:10px;padding-top:10px;">${detailRows}</div>`
          : ""
      }
      <div style="border-top:1px dashed #111;margin-top:10px;padding-top:10px;">
        <strong>MESSAGE:</strong><br />
        ${inquiry.message.replace(/\n/g, "<br />")}
      </div>
      <div style="border-top:2px dashed #111;margin-top:14px;padding-top:8px;text-align:center;font-size:10px;letter-spacing:1px;">
        *** END OF TICKET ***
      </div>
    </div>
  `;
}
