"use client";

import { useState, useTransition } from "react";
import { useRouter }               from "next/navigation";
import { useForm }                 from "react-hook-form";
import { zodResolver }             from "@hookform/resolvers/zod";
import Link                        from "next/link";

import { registerSchema, type RegisterInput }                   from "@/lib/validations/auth";
import { registerAction }                                       from "@/lib/actions/auth.action";
import { AuthInput, AuthButton, AuthDivider, FormError, FormSuccess } from "@/components/auth/auth-field";
import { GoogleButton }                                         from "@/components/auth/google-button";
import { cx, ds }                                               from "@/style";


function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;

  const checks = [
    { label: "8+ chars",  ok: value.length >= 8           },
    { label: "Uppercase", ok: /[A-Z]/.test(value)         },
    { label: "Number",    ok: /[0-9]/.test(value)         },
    { label: "Special",   ok: /[^A-Za-z0-9]/.test(value) },
  ];
  const score     = checks.filter((c) => c.ok).length;
  const barColors = ["bg-red-500", "bg-teal-500", "bg-yellow-400", "bg-emerald-400"] as const;
  const barColor  = score > 0 ? barColors[Math.min(score - 1, 3)] : "bg-[var(--bd)]";

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cx(
              "h-[3px] flex-1 transition-all duration-300",
              i < score ? barColor : "bg-[var(--bd)]",
            )}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {checks.map(({ label, ok }) => (
          <span
            key={label}
            className={cx(
              "font-mono text-[9px] px-1.5 py-0.5 border transition-all duration-200",
              ok
                ? "border-[var(--ac-1-ring)] text-[var(--ac-1)] bg-[var(--ac-1-dim)]"
                : "border-[var(--bd)] text-[var(--tx-4)]",
            )}
          >
            {ok && "✓ "}
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}


interface RegisterFormProps {
  /** Pre-filled email — passed from landing page CTA via ?email= query param */
  defaultEmail?: string;
}

export function RegisterForm({ defaultEmail }: RegisterFormProps) {
  const router = useRouter();
  const [isPending, startTransition]  = useTransition();
  const [serverError,   setServerError]   = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver:      zodResolver(registerSchema),
    mode:          "onBlur",
    defaultValues: { email: defaultEmail ?? "" },
  });

  const passwordValue = watch("password", "");
  const isLoading     = isSubmitting || isPending;

  function onSubmit(data: RegisterInput) {
    setServerError(null);
    setServerSuccess(null);

    startTransition(async () => {
      const result = await registerAction(data);

      if (result.ok) {
        setServerSuccess("Account created! Taking you to your dashboard…");
        router.refresh();
        setTimeout(() => router.push("/dashboard"), 900);
      } else {
        setServerError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-5">

      <GoogleButton label="Sign up with Google" />

      <AuthDivider label="or sign up with email" />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

        <FormError   message={serverError}   />
        <FormSuccess message={serverSuccess} />

        <AuthInput
          label="Full name"
          type="text"
          placeholder="Alex Kim"
          autoComplete="name"
          autoFocus={!defaultEmail} 
          disabled={isLoading}
          error={errors.name?.message}
          {...register("name")}
        />

        <AuthInput
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus={!!defaultEmail}
          disabled={isLoading}
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <AuthInput
            label="Password"
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            disabled={isLoading}
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrength value={passwordValue} />
        </div>

        <AuthInput
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          disabled={isLoading}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <AuthButton type="submit" loading={isLoading} className="mt-1">
          → Create Account
        </AuthButton>
      </form>

      <p className="font-mono text-[11px] text-center text-[var(--tx-4)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[var(--ac-1)] opacity-80 hover:opacity-100 transition-opacity"
        >
          Sign in →
        </Link>
      </p>

      <p className={cx(ds.micro, "text-center")}>
        By creating an account you agree to our{" "}
        <a
          href="/terms"
          className="underline underline-offset-2 hover:text-[var(--tx-3)] transition-colors"
        >
          Terms
        </a>
        {" & "}
        <a
          href="/privacy"
          className="underline underline-offset-2 hover:text-[var(--tx-3)] transition-colors"
        >
          Privacy
        </a>
        .
      </p>
    </div>
  );
}