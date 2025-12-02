import { SkeletonTable } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <SkeletonTable rows={8} />
      </div>
    </div>
  );
}
