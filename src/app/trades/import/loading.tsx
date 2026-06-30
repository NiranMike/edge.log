import { SkeletonShell, Skeleton } from "@/components/ui/skeleton";

const STEP_KEYS = ["s1", "s2", "s3"];
const BADGE_KEYS = ["b0", "b1", "b2", "b3", "b4", "b5"];

export default function ImportLoading() {
  return (
    <SkeletonShell maxWidth={760}>
      {/* Breadcrumb + header */}
      <div className="mb-8 sm:mb-10">
        <Skeleton className="h-2.5 w-28 mb-6" />
        <div className="flex items-start gap-3">
          <div className="w-[3px] h-10 mt-1 rounded-full shrink-0 bg-gradient-to-b from-teal-400/40 to-transparent" />
          <div>
            <Skeleton className="h-5 w-40 mb-2.5" />
            <Skeleton className="h-3 w-80 max-w-full" />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8 sm:mb-10">
        {STEP_KEYS.map((k, i) => (
          <div key={k} className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-2.5 w-20 hidden sm:block" />
            {i < STEP_KEYS.length - 1 && <div className="w-8 sm:w-12 h-px bg-white/[0.06]" />}
          </div>
        ))}
      </div>

      {/* Source badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {BADGE_KEYS.map(k => <Skeleton key={k} className="h-6 w-24 rounded" />)}
      </div>

      {/* Dropzone */}
      <Skeleton className="h-[280px] w-full rounded-lg" />
    </SkeletonShell>
  );
}
