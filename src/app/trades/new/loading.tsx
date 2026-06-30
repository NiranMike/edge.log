import { SkeletonShell, CardSkeleton, Skeleton } from "@/components/ui/skeleton";

const FIELD_KEYS = ["f0", "f1", "f2", "f3", "f4", "f5"];

export default function NewTradeLoading() {
  return (
    <SkeletonShell maxWidth={640}>
      <div className="mb-7">
        <Skeleton className="h-5 w-40 mb-2.5" />
        <Skeleton className="h-3 w-56" />
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
