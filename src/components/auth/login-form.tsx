"use client";

import { useState, useTransition } from "react";
import { useRouter }               from "next/navigation";
import { useForm }                 from "react-hook-form";
import { zodResolver }             from "@hookform/resolvers/zod";
import Link                        from "next/link";

import { loginSchema, type LoginInput }           from "@/lib/validations/auth";
import { loginAction }                            from "@/lib/actions/auth.action";
import { AuthInput, AuthButton, AuthDivider, FormError } from "@/components/auth/auth-field";
import { GoogleButton }                           from "@/components/auth/google-button";
import { cx, ds }                                 from "@/style";

const URL_ERROR_MAP: Record<string, string> = {
  CredentialsSignin:        "Invalid email or password.",
  OAuthAccountNotLinked:    "This email is linked to a different sign-in method.",
  OAuthSignin:              "Could not sign in with Google. Please try again.",
  SessionRequired:          "Please sign in to continue.",
  default:                  "Something went wrong. Please try again.",
};

interface LoginFormProps {
  callbackUrl: string;
  urlError?:   string;
}

export function LoginForm({ callbackUrl, urlError }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(
    urlError ? (URL_ERROR_MAP[urlError] ?? URL_ERROR_MAP.default) : null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode:     "onBlur",
  });

  const isLoading = isSubmitting || isPending;

  function onSubmit(data: LoginInput) {
    setServerError(null);
    startTransition(async () => {
      const result = await loginAction(data);
      if (result.success) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setServerError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-5">

      <GoogleButton callbackUrl={callbackUrl} label="Continue with Google" />

      <AuthDivider label="or sign in with email" />

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

        <div className="flex flex-col gap-1">
          <AuthInput
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="font-mono text-[10px] text-white/22 hover:text-emerald-400 transition-colors duration-150 uppercase tracking-[0.15em] mt-1"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <AuthButton type="submit" loading={isLoading}>
          → Sign In
        </AuthButton>
      </form>

      <p className="font-mono text-[11px] text-center text-white/22">
        No account?{" "}
        <Link href="/register" className="text-emerald-400/80 hover:text-emerald-400 transition-colors">
          Create one free →
        </Link>
      </p>

      <p className={cx(ds.micro, "text-center")}>
        By continuing you agree to our{" "}
        <a href="/terms" className="underline underline-offset-2 hover:text-white/35 transition-colors">Terms</a>
        {" & "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-white/35 transition-colors">Privacy</a>.
      </p>
    </div>
  );
}