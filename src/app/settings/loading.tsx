import { SkeletonShell, HeaderSkeleton, CardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <SkeletonShell maxWidth={680}>
      <div className="space-y-8">
        <HeaderSkeleton subtitle={false} className="" />
        <div>
          <Skeleton className="h-2.5 w-20 mb-3" />
          <CardSkeleton className="h-[150px]" />
        </div>
        <div>
          <Skeleton className="h-2.5 w-20 mb-3" />
          <CardSkeleton className="h-[120px]" />
        </div>
      </div>
    </SkeletonShell>
  );
}
