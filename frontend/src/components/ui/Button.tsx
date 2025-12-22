'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-xl
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-[0.97]
      [&>svg]:transition-transform [&>svg]:duration-200
      [&:hover>svg]:scale-110
    `;

    const variants = {
      primary: `
        bg-lana-500 text-white
        hover:bg-lana-600 hover:shadow-lg hover:shadow-lana-500/25 hover:-translate-y-0.5
        focus-visible:ring-lana-500
      `,
      secondary: `
        bg-slate-100 text-slate-700
        hover:bg-slate-200 hover:shadow-md hover:-translate-y-0.5
        focus-visible:ring-slate-400
        dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700
      `,
      ghost: `
        bg-transparent text-slate-600
        hover:bg-slate-100 hover:text-slate-900
        focus-visible:ring-slate-400
        dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white
      `,
      danger: `
        bg-red-500 text-white
        hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5
        focus-visible:ring-red-500
      `,
      outline: `
        bg-transparent text-lana-600 border-2 border-lana-500
        hover:bg-lana-50 hover:border-lana-600 hover:-translate-y-0.5
        focus-visible:ring-lana-500
        dark:text-lana-400 dark:hover:bg-lana-900/20
      `,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
      icon: 'p-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
