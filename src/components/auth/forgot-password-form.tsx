"use client";

import { useState, useTransition } from "react";
import { useForm }                 from "react-hook-form";
import { zodResolver }             from "@hookform/resolvers/zod";
import Link                        from "next/link";

import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { requestPasswordResetAction }                     from "@/lib/actions/password-reset.action";
import { AuthInput, AuthButton, FormError, FormSuccess }  from "@/components/auth/auth-field";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent]              = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode:     "onBlur",
  });

  const isLoading = isSubmitting || isPending;

  function onSubmit(data: ForgotPasswordInput) {
    setServerError(null);
    startTransition(async () => {
      const result = await requestPasswordResetAction(data.email);
      if (result.ok) {
        setSent(true);
      } else {
        setServerError(result.error);
      }
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-5">
        <FormSuccess message={`We've sent a reset link to ${getValues("email")}. Check your inbox — it expires in 1 hour.`} />
        <p className="font-mono text-[11px] text-center text-white/22">
          Didn't receive it?{" "}
          <button
            onClick={() => setSent(false)}
            className="text-emerald-400/80 hover:text-emerald-400 transition-colors underline underline-offset-2"
          >
            Try again
          </button>
        </p>
        <p className="font-mono text-[11px] text-center text-white/22">
          <Link href="/login" className="text-white/35 hover:text-white/55 transition-colors">
            ← Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <FormError message={serverError} />

      <AuthInput
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        autoFocus
        disabled={isLoading}
        error={errors.email?.message}
        {...register("email")}
      />

      <AuthButton type="submit" loading={isLoading}>
        → Send Reset Link
      </AuthButton>

      <p className="font-mono text-[11px] text-center text-white/22">
        <Link href="/login" className="text-white/35 hover:text-white/55 transition-colors">
          ← Back to sign in
        </Link>
      </p>
    </form>
  );
}
