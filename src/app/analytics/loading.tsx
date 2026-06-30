import { SkeletonShell, HeaderSkeleton, CardSkeleton, Skeleton } from "@/components/ui/skeleton";

const STAT_KEYS = ["o0", "o1", "o2", "o3", "o4", "o5"];
const CARD_KEYS = ["c0", "c1", "c2", "c3"];

export default function AnalyticsLoading() {
  return (
    <SkeletonShell maxWidth={1200}>
      <HeaderSkeleton />

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      {/* Overview strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4 sm:mb-6">
        {STAT_KEYS.map(k => (
          <div key={k} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
            <Skeleton className="h-2.5 w-16 mb-2.5" />
            <Skeleton className="h-5 w-14" />
          </div>
        ))}
      </div>

      {/* Two-column breakdown cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {CARD_KEYS.map(k => <CardSkeleton key={k} className="h-[260px]" />)}
      </div>

      {/* Equity curve + heatmap */}
      <CardSkeleton className="h-[320px] mb-4 sm:mb-6" />
      <CardSkeleton className="h-[200px]" />
    </SkeletonShell>
  );
}
