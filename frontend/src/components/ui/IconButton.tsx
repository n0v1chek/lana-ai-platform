'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'solid' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      tooltip,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center
      rounded-xl
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-lana-500
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-90
      [&>svg]:transition-all [&>svg]:duration-200
      hover:[&>svg]:scale-110
    `;

    const variants = {
      default: `
        text-slate-500
        hover:text-slate-900 hover:bg-slate-100
        dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800
      `,
      ghost: `
        text-slate-400
        hover:text-slate-600 hover:bg-slate-50
        dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800/50
      `,
      solid: `
        bg-slate-100 text-slate-600
        hover:bg-slate-200 hover:text-slate-900 hover:shadow-md hover:-translate-y-0.5
        dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white
      `,
      danger: `
        text-slate-400
        hover:text-red-500 hover:bg-red-50
        dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-red-900/20
      `,
    };

    const sizes = {
      sm: 'p-1.5 [&>svg]:w-4 [&>svg]:h-4',
      md: 'p-2 [&>svg]:w-5 [&>svg]:h-5',
      lg: 'p-3 [&>svg]:w-6 [&>svg]:h-6',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        title={tooltip}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
