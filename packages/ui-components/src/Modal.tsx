'use client';

import React, { useEffect } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  /** Controls whether the modal is visible */
  open: boolean;
  /** Callback when the modal requests to close */
  onClose: () => void;
  /** Modal header title */
  title?: string;
  /** Subtitle displayed below the title */
  description?: string;
  /** Content rendered in the footer action area */
  footer?: React.ReactNode;
  /** Width variant */
  size?: ModalSize;
  /** Prevent closing by clicking the backdrop */
  disableBackdropClose?: boolean;
  children: React.ReactNode;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const CloseIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  disableBackdropClose = false,
}: ModalProps) {
  // Keyboard: Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={disableBackdropClose ? undefined : onClose}
        aria-hidden="true"
        style={{ animation: 'fadeIn 0.2s ease both' }}
      />

      {/* Panel */}
      <div
        className={[
          'relative z-10 w-full rounded-2xl overflow-hidden',
          'bg-[hsl(222,25%,12%)] border border-white/10',
          'shadow-2xl shadow-black/60',
          'animate-scale-in',
          sizeStyles[size],
        ].join(' ')}
        style={{ animation: 'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/8 px-6 py-5">
          <div className="min-w-0">
            {title && (
              <h2 id="modal-title" className="text-base font-semibold text-white leading-snug">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-[hsl(220,12%,55%)] leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={[
              'shrink-0 rounded-lg p-1.5 text-[hsl(220,12%,50%)]',
              'hover:bg-white/8 hover:text-white',
              'transition-all duration-150',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500',
            ].join(' ')}
            aria-label="Close dialog"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-white/8 px-6 py-4 bg-white/2">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  );
}
