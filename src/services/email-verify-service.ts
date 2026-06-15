import crypto   from "crypto";
import { db }   from "@/lib/db";

const TOKEN_TTL_HOURS = 24;

async function generateToken(userId: string): Promise<string> {
  await db.emailVerifyToken.deleteMany({ where: { userId } });

  const token     = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  await db.emailVerifyToken.create({ data: { userId, token, expiresAt } });
  return token;
}

async function sendVerificationEmail(email: string, name: string | null, token: string): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email/${token}`;

  const res = await fetch("https://api.resend.com/emails", {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:    `Edge.Log <noreply@${process.env.EMAIL_FROM_DOMAIN}>`,
      to:      email,
      subject: "Verify your Edge.Log account",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="background:#07090d;color:#e2e8f0;font-family:monospace;padding:40px 20px;max-width:520px;margin:0 auto;">
            <p style="font-size:22px;font-weight:700;color:#fff;margin-bottom:8px;">EDGE<span style="color:#2dd4bf">.</span>LOG</p>
            <p style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.15em;margin-bottom:32px;">Email verification</p>

            <p style="font-size:14px;color:#94a3b8;line-height:1.7;margin-bottom:28px;">
              Hi ${name ?? "Trader"},<br><br>
              Click the button below to verify your email and activate your account.
              This link expires in ${TOKEN_TTL_HOURS} hours.
            </p>

            <a href="${url}"
              style="display:inline-block;background:#2dd4bf;color:#07090d;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.12em;padding:14px 28px;text-decoration:none;margin-bottom:28px;">
              Verify Email 
            </a>

            <p style="font-size:11px;color:#334155;margin-top:24px;border-top:1px solid #1e293b;padding-top:20px;">
              If you didn't create an account, you can safely ignore this email.<br>
              Link: <span style="color:#475569;">${url}</span>
            </p>
          </body>
        </html>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Resend API error ${res.status}: ${JSON.stringify(body)}`);
  }
}

export const emailVerifyService = {
  async issue(userId: string, email: string, name: string | null): Promise<void> {
    const token = await generateToken(userId);
    await sendVerificationEmail(email, name, token);
  },

  async verify(token: string): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
    const record = await db.emailVerifyToken.findUnique({ where: { token } });

    if (!record)                         return { ok: false, error: "Invalid or already used verification link." };
    if (record.expiresAt < new Date())   return { ok: false, error: "This link has expired. Request a new one." };

    await db.$transaction([
      db.user.update({
        where: { id: record.userId },
        data:  { emailVerified: new Date() },
      }),
      db.emailVerifyToken.delete({ where: { token } }),
    ]);

    return { ok: true, userId: record.userId };
  },

  async resend(email: string): Promise<{ ok: boolean; error?: string }> {
    const user = await db.user.findUnique({
      where:  { email },
      select: { id: true, name: true, emailVerified: true },
    });

    if (!user)              return { ok: false, error: "No account found with that email." };
    if (user.emailVerified) return { ok: false, error: "This email is already verified." };

    await emailVerifyService.issue(user.id, email, user.name);
    return { ok: true };
  },
};