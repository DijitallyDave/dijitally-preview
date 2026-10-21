import { NextResponse } from "next/server";

/**
 * Receives the "Get in touch" form and emails it via Resend (https://resend.com).
 *
 * Configure in .env.local (see .env.example):
 *   RESEND_API_KEY      API key from the Resend dashboard
 *   CONTACT_TO_EMAIL    where enquiries are delivered
 *   CONTACT_FROM_EMAIL  sender on a domain verified in Resend, e.g. "Dijitally <website@dijitally.com>"
 *
 * Without them, development logs the submission and reports success so the form can be
 * exercised locally; production refuses rather than silently dropping enquiries.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const notes = String(body.notes ?? "").trim();

  // Honeypot filled in: almost certainly a bot. Pretend it worked.
  if (String(body.company ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  if (!name || name.length > 200 || !EMAIL.test(email) || email.length > 320 || notes.length > 5000) {
    return NextResponse.json({ error: "Please check your name and email." }, { status: 422 });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] Email not configured; submission:", { name, email, notes });
      return NextResponse.json({ ok: true, delivered: false });
    }
    console.error("[contact] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not set");
    return NextResponse.json({ error: "Contact form is not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL.split(",").map((s) => s.trim()),
      reply_to: email,
      subject: `New enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${notes || "(no notes)"}`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text());
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
