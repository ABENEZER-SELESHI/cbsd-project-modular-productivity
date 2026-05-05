'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label displayed above the input */
  label?: string;
  /** Validation error message */
  error?: string;
  /** Helper text shown below the input (hidden when error is present) */
  hint?: string;
  /** Icon or element placed inside the left side of the input */
  leftAdornment?: React.ReactNode;
  /** Icon or element placed inside the right side of the input */
  rightAdornment?: React.ReactNode;
  /** Show character count (requires maxLength) */
  showCount?: boolean;
}

export function Input({
  label,
  error,
  hint,
  leftAdornment,
  rightAdornment,
  showCount = false,
  className = '',
  id,
  maxLength,
  value,
  defaultValue,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? undefined;
  const [internalValue, setInternalValue] = React.useState(
    (defaultValue as string) ?? ''
  );
  const currentValue = (value as string) ?? internalValue;
  const charCount = currentValue.length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row */}
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[hsl(220,12%,75%)]"
          >
            {label}
          </label>
          {showCount && maxLength && (
            <span className="text-xs text-[hsl(220,12%,45%)]">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {leftAdornment && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[hsl(220,12%,50%)]">
            {leftAdornment}
          </div>
        )}

        <input
          id={inputId}
          maxLength={maxLength}
          value={value !== undefined ? value : undefined}
          defaultValue={value !== undefined ? undefined : defaultValue}
          onChange={handleChange}
          className={[
            'w-full rounded-xl border px-3 py-2.5 text-sm text-white',
            'bg-[hsl(222,25%,10%)] placeholder-[hsl(220,12%,40%)]',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-transparent',
            error
              ? 'border-red-500/60 focus:border-red-400 focus:ring-red-500/30'
              : 'border-white/10 focus:border-blue-500/70 focus:ring-blue-500/25',
            leftAdornment ? 'pl-10' : '',
            rightAdornment ? 'pr-10' : '',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          ].join(' ')}
          {...props}
        />

        {rightAdornment && (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[hsl(220,12%,50%)]">
            {rightAdornment}
          </div>
        )}
      </div>

      {/* Helper / Error text */}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-[hsl(220,12%,50%)]">{hint}</p>
      )}
    </div>
  );
}
