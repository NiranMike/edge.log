import { SkeletonShell, HeaderSkeleton, StatCardsSkeleton, TableSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <SkeletonShell maxWidth={1120}>
      <HeaderSkeleton />
      <div className="mb-8 sm:mb-10">
        <StatCardsSkeleton count={4} />
      </div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <Skeleton className="h-2.5 w-28" />
        <Skeleton className="h-2.5 w-14" />
      </div>
      <TableSkeleton rows={6} />
    </SkeletonShell>
  );
}
