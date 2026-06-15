"use server";

import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { passwordResetService }                      from "@/services/password-reset-service";
import type { Result }                               from "@/types";

export async function requestPasswordResetAction(email: string): Promise<Result> {
  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  await passwordResetService.request(parsed.data.email);

  // Always succeed — don't reveal whether the email exists
  return { ok: true, data: undefined };
}

export async function resetPasswordAction(token: string, password: string, confirmPassword: string): Promise<Result> {
  const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>;
    const firstError  = Object.values(fieldErrors).flat()[0] ?? "Please fix the errors below.";
    return { ok: false, error: firstError, fieldErrors };
  }

  const result = await passwordResetService.reset(token, parsed.data.password);
  return result.ok
    ? { ok: true, data: undefined }
    : { ok: false, error: result.error! };
}
