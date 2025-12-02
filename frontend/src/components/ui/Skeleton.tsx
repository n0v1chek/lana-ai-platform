import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-700';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  ));

  return count > 1 ? <div className="space-y-2">{items}</div> : items[0];
};

// Готовые компоненты для частых случаев
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${className}`}>
    <Skeleton variant="rectangular" height={20} width="60%" className="mb-4" />
    <Skeleton count={3} className="mb-2" />
    <Skeleton width="40%" />
  </div>
);

export const SkeletonChat: React.FC = () => (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <Skeleton width={200} height={32} variant="rectangular" />
    </div>
    <div className="flex-1 p-4 space-y-4">
      <div className="flex justify-end">
        <Skeleton width="60%" height={60} variant="rectangular" />
      </div>
      <div className="flex justify-start">
        <Skeleton width="70%" height={80} variant="rectangular" />
      </div>
      <div className="flex justify-end">
        <Skeleton width="50%" height={40} variant="rectangular" />
      </div>
    </div>
    <div className="p-4 border-t border-slate-200 dark:border-slate-700">
      <Skeleton height={48} variant="rectangular" />
    </div>
  </div>
);

export const SkeletonProfile: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" width={64} height={64} />
      <div className="flex-1">
        <Skeleton width="40%" height={24} className="mb-2" />
        <Skeleton width="60%" height={16} />
      </div>
    </div>
    <SkeletonCard />
    <SkeletonCard />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    <Skeleton height={40} variant="rectangular" className="mb-4" />
    {Array.from({ length: rows }, (_, i) => (
      <Skeleton key={i} height={48} variant="rectangular" />
    ))}
  </div>
);

export const SkeletonPricing: React.FC = () => (
  <div className="space-y-6">
    <div className="p-6 rounded-2xl bg-gradient-to-r from-lana-500 to-violet-500">
      <Skeleton width="30%" height={16} className="mb-2 !bg-white/20" />
      <Skeleton width="50%" height={32} className="!bg-white/20" />
    </div>
    <SkeletonCard />
    <div className="grid grid-cols-2 gap-4">
      <Skeleton height={80} variant="rectangular" />
      <Skeleton height={80} variant="rectangular" />
    </div>
  </div>
);

export default Skeleton;
