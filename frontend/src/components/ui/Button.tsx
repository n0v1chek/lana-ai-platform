'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
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
      transition-all duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variants = {
      primary: `
        bg-lana-500 text-white
        hover:bg-lana-600 hover:shadow-lg hover:shadow-lana-500/25
        focus-visible:ring-lana-500
        active:scale-[0.98]
      `,
      secondary: `
        bg-slate-100 text-slate-700
        hover:bg-slate-200
        focus-visible:ring-slate-400
        dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700
      `,
      ghost: `
        bg-transparent text-slate-600
        hover:bg-slate-100
        focus-visible:ring-slate-400
        dark:text-slate-300 dark:hover:bg-slate-800
      `,
      danger: `
        bg-red-500 text-white
        hover:bg-red-600
        focus-visible:ring-red-500
      `,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
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
