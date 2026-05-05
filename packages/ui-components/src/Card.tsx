import React from 'react';

export type CardVariant = 'default' | 'glass' | 'outline' | 'elevated';

export interface CardProps {
  /** Visual style of the card */
  variant?: CardVariant;
  /** Card header title */
  title?: string;
  /** Subtle description below the title */
  description?: string;
  /** Optional icon/badge displayed next to the title */
  titleAdornment?: React.ReactNode;
  /** Content rendered in the footer area */
  footer?: React.ReactNode;
  /** Lift card on hover */
  hoverable?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-[hsl(222,25%,12%)] border border-[hsl(222,20%,20%)]',
  glass: [
    'bg-white/5 border border-white/10',
    'backdrop-blur-xl backdrop-saturate-150',
  ].join(' '),
  outline: 'bg-transparent border-2 border-[hsl(220,100%,60%)]/40',
  elevated: 'bg-[hsl(222,22%,16%)] border border-[hsl(222,20%,22%)] shadow-xl shadow-black/40',
};

export function Card({
  variant = 'default',
  title,
  description,
  titleAdornment,
  footer,
  hoverable = false,
  className = '',
  children,
}: CardProps) {
  return (
    <div
      className={[
        'rounded-2xl overflow-hidden',
        variantStyles[variant],
        hoverable
          ? 'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20 hover:border-blue-500/30 cursor-pointer'
          : '',
        className,
      ].join(' ')}
    >
      {/* Header */}
      {(title || description) && (
        <div className="flex items-start justify-between gap-3 border-b border-white/6 px-6 py-5">
          <div className="min-w-0">
            {title && (
              <h3 className="text-[15px] font-semibold text-white leading-snug truncate">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-[hsl(220,12%,55%)] leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {titleAdornment && (
            <div className="shrink-0">{titleAdornment}</div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="px-6 py-5">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="flex items-center justify-end gap-2 border-t border-white/6 px-6 py-4 bg-white/3">
          {footer}
        </div>
      )}
    </div>
  );
}
