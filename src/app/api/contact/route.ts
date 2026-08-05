import { NextResponse } from "next/server";
import {
  sendInquiryEmail,
  EmailNotConfiguredError,
  type InquiryType,
} from "@/lib/services/email";

const VALID_TYPES: InquiryType[] = ["general", "catering", "bulk-order", "order"];

function isValidType(value: unknown): value is InquiryType {
  return typeof value === "string" && VALID_TYPES.includes(value as InquiryType);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { type, name, email, phone, message, details } = body as Record<
    string,
    unknown
  >;

  if (!isValidType(type)) {
    return NextResponse.json({ error: "Invalid inquiry type." }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  // Message is optional (e.g. a special order with no extra notes) —
  // details like quantity/date already carry the substance of the ask.
  if (message !== undefined && typeof message !== "string") {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }

  try {
    await sendInquiryEmail({
      type,
      name,
      email,
      phone: typeof phone === "string" ? phone : undefined,
      message: typeof message === "string" && message.trim() ? message : "(none provided)",
      details:
        details && typeof details === "object"
          ? (details as Record<string, string>)
          : undefined,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof EmailNotConfiguredError) {
      // Not the visitor's fault — surface a clear signal in server logs
      // while giving the UI a distinct status to show a graceful message.
      console.error(err.message);
      return NextResponse.json(
        { error: "Inquiries aren't wired up yet — please call instead." },
        { status: 503 }
      );
    }
    console.error("Failed to send inquiry email:", err);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again." },
      { status: 500 }
    );
  }
}
