import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090d] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] text-center">

        <p className="font-mono font-medium text-[52px] leading-none tracking-[-0.03em] text-white/15 mb-4">
          404
        </p>

        <div className="w-14 h-14 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-6">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-teal-400">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="font-mono font-medium text-[20px] text-white tracking-[-0.02em] mb-2">
          Page not found
        </h1>
        <p className="font-mono text-[12px] text-white/40 leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/dashboard"
            className="w-full py-3 rounded-lg bg-emerald-400 text-[#07090d] font-mono text-[12px] font-medium no-underline hover:brightness-110 active:scale-[0.98] transition-all duration-150"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="w-full py-3 rounded-lg border border-white/[0.08] font-mono text-[12px] text-white/50 no-underline hover:text-white/80 hover:border-white/15 transition-all duration-150"
          >
            Back to home
          </Link>
        </div>

      </div>
    </div>
  );
}
