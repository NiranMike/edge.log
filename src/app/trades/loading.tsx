import { SkeletonShell, HeaderSkeleton, TableSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function TradesLoading() {
  return (
    <SkeletonShell maxWidth={1200}>
      <div className="flex items-end justify-between gap-4 mb-6 sm:mb-7">
        <HeaderSkeleton className="" />
        <div className="flex gap-2 shrink-0">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-5">
        <Skeleton className="h-9 w-full max-w-[260px] rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      <TableSkeleton rows={8} />
    </SkeletonShell>
  );
}
