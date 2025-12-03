import { CatLogo } from '@/components/CatLogo';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <CatLogo size={80} />
        </div>
        <div className="mt-6 flex justify-center">
          <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full animate-loading-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
