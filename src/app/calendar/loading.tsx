import { SkeletonShell, HeaderSkeleton, CardSkeleton, Skeleton } from "@/components/ui/skeleton";

const WEEKDAY_KEYS = ["w0", "w1", "w2", "w3", "w4", "w5", "w6"];
const CELL_KEYS = Array.from({ length: 42 }, (_, i) => `cell-${i}`);

export default function CalendarLoading() {
  return (
    <SkeletonShell maxWidth={1120}>
      <HeaderSkeleton />
      <CardSkeleton className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <Skeleton className="h-4 w-36" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-7 rounded" />
            <Skeleton className="h-7 w-7 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
          {WEEKDAY_KEYS.map(k => <Skeleton key={k} className="h-2.5 w-8 mx-auto" />)}
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {CELL_KEYS.map(k => <Skeleton key={k} className="aspect-square rounded-md" />)}
        </div>
      </CardSkeleton>
    </SkeletonShell>
  );
}
