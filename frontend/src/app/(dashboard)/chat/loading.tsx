import { SkeletonChat } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900">
      <SkeletonChat />
    </div>
  );
}
