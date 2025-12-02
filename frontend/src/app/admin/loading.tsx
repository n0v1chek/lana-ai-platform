import { SkeletonTable, Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Skeleton width={200} height={32} className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} height={100} variant="rectangular" />
          ))}
        </div>
        <SkeletonTable rows={10} />
      </div>
    </div>
  );
}
