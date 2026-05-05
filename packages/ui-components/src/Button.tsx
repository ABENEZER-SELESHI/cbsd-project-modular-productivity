import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Show a spinning loader and disable interaction */
  loading?: boolean;
  /** Icon placed before the label */
  leftIcon?: React.ReactNode;
  /** Icon placed after the label */
  rightIcon?: React.ReactNode;
  /** Stretch button to full container width */
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-gradient-to-r from-blue-500 to-violet-500',
    'text-white shadow-lg shadow-blue-500/25',
    'hover:from-blue-400 hover:to-violet-400 hover:shadow-blue-500/40',
    'active:scale-[0.97]',
  ].join(' '),

  secondary: [
    'bg-white/8 text-white border border-white/10',
    'hover:bg-white/14 hover:border-white/20',
    'active:scale-[0.97]',
  ].join(' '),

  ghost: [
    'bg-transparent text-blue-400',
    'hover:bg-blue-500/10 hover:text-blue-300',
    'active:scale-[0.97]',
  ].join(' '),

  danger: [
    'bg-gradient-to-r from-red-500 to-rose-500',
    'text-white shadow-lg shadow-red-500/25',
    'hover:from-red-400 hover:to-rose-400 hover:shadow-red-500/40',
    'active:scale-[0.97]',
  ].join(' '),

  outline: [
    'bg-transparent border border-blue-500/60 text-blue-400',
    'hover:bg-blue-500/10 hover:border-blue-400',
    'active:scale-[0.97]',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12" cy="12" r="10"
      stroke="currentColor" strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center rounded-xl font-semibold',
        'transition-all duration-200 ease-out',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
        'disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <Spinner />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
