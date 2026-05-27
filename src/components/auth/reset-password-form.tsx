"use client";

import { useState, useTransition } from "react";
import { useRouter }               from "next/navigation";
import { useForm }                 from "react-hook-form";
import { zodResolver }             from "@hookform/resolvers/zod";

import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { resetPasswordAction }                          from "@/lib/actions/password-reset.action";
import { AuthInput, AuthButton, FormError, PasswordStrength } from "@/components/auth/auth-field";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode:     "onBlur",
  });

  const isLoading  = isSubmitting || isPending;
  const passwordVal = watch("password") ?? "";

  function onSubmit(data: ResetPasswordInput) {
    setServerError(null);
    startTransition(async () => {
      const result = await resetPasswordAction(token, data.password, data.confirmPassword);
      if (result.ok) {
        router.push("/login?reset=1");
      } else {
        setServerError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <FormError message={serverError} />

      <div className="flex flex-col gap-1.5">
        <AuthInput
          label="New password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          autoFocus
          disabled={isLoading}
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordStrength value={passwordVal} />
      </div>

      <AuthInput
        label="Confirm new password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        disabled={isLoading}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <AuthButton type="submit" loading={isLoading}>
        → Set New Password
      </AuthButton>
    </form>
  );
}
