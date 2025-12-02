import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-lana-500 to-violet-500 animate-pulse" />
        <Skeleton width={120} height={20} className="mx-auto" />
      </div>
    </div>
  );
}
