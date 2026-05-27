"use server";

import { emailVerifyService } from "@/services/email-verify-service";
import type { Result }        from "@/types";

export async function resendVerificationAction(email: string): Promise<Result> {
  if (!email) return { ok: false, error: "Email is required." };

  const result = await emailVerifyService.resend(email);
  return result.ok
    ? { ok: true, data: undefined }
    : { ok: false, error: result.error! };
}
