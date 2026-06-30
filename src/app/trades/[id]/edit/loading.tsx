import { SkeletonShell, CardSkeleton, Skeleton } from "@/components/ui/skeleton";

const FIELD_KEYS = ["f0", "f1", "f2", "f3", "f4", "f5"];

export default function EditTradeLoading() {
  return (
    <SkeletonShell maxWidth={640}>
      {/* Breadcrumb */}
      <Skeleton className="h-2.5 w-44 mb-8 sm:mb-10" />

      {/* Original result banner */}
      <div className="mb-7 sm:mb-9 rounded-[6px] bg-white/[0.02] border border-white/[0.06] px-4 py-3 flex items-center justify-between">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>

      <CardSkeleton className="p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {FIELD_KEYS.map(k => (
            <div key={k}>
              <Skeleton className="h-2.5 w-20 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
      </CardSkeleton>
    </SkeletonShell>
  );
}
