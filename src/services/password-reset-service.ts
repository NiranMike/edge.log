import crypto from "crypto";
import bcrypt  from "bcryptjs";
import { db }  from "@/lib/db";

const TOKEN_TTL_HOURS = 1;

async function generateToken(userId: string): Promise<string> {
  await db.passwordResetToken.deleteMany({ where: { userId } });

  const token     = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  await db.passwordResetToken.create({ data: { userId, token, expiresAt } });
  return token;
}

async function sendResetEmail(email: string, name: string | null, token: string): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

  const res = await fetch("https://api.resend.com/emails", {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:    `Edge.Log <noreply@${process.env.EMAIL_FROM_DOMAIN}>`,
      to:      email,
      subject: "Reset your Edge.Log password",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="background:#07090d;color:#e2e8f0;font-family:monospace;padding:40px 20px;max-width:520px;margin:0 auto;">
            <p style="font-size:22px;font-weight:700;color:#fff;margin-bottom:8px;">EDGE<span style="color:#2dd4bf">.</span>LOG</p>
            <p style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.15em;margin-bottom:32px;">Password reset</p>

            <p style="font-size:14px;color:#94a3b8;line-height:1.7;margin-bottom:28px;">
              Hi ${name ?? "Trader"},<br><br>
              Someone requested a password reset for your account. Click the button below to choose a new password.
              This link expires in ${TOKEN_TTL_HOURS} hour.
            </p>

            <a href="${url}"
              style="display:inline-block;background:#2dd4bf;color:#07090d;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.12em;padding:14px 28px;text-decoration:none;margin-bottom:28px;">
              Reset Password →
            </a>

            <p style="font-size:11px;color:#334155;margin-top:24px;border-top:1px solid #1e293b;padding-top:20px;">
              If you didn't request this, you can safely ignore this email. Your password won't change.<br>
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

export const passwordResetService = {
  // Always returns ok:true to avoid leaking whether an email exists.
  async request(email: string): Promise<{ ok: true }> {
    const user = await db.user.findUnique({
      where:  { email },
      select: { id: true, name: true, passwordHash: true },
    });

    // Silently skip OAuth-only accounts or unknown emails
    if (user?.passwordHash) {
      const token = await generateToken(user.id);
      await sendResetEmail(email, user.name, token).catch((err) => {
        console.error("[passwordResetService.request] email send failed:", err);
      });
    }

    return { ok: true };
  },

  async verify(token: string): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
    const record = await db.passwordResetToken.findUnique({ where: { token } });

    if (!record)                       return { ok: false, error: "Invalid or already used reset link." };
    if (record.expiresAt < new Date()) return { ok: false, error: "This link has expired. Request a new one." };

    return { ok: true, userId: record.userId };
  },

  async reset(token: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
    const record = await db.passwordResetToken.findUnique({ where: { token } });

    if (!record)                       return { ok: false, error: "Invalid or already used reset link." };
    if (record.expiresAt < new Date()) return { ok: false, error: "This link has expired. Request a new one." };

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.$transaction([
      db.user.update({ where: { id: record.userId }, data: { passwordHash } }),
      db.passwordResetToken.delete({ where: { token } }),
    ]);

    return { ok: true };
  },
};
