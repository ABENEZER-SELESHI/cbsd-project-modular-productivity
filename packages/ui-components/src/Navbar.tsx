'use client';

import React, { useState, useEffect } from 'react';

export interface NavLink {
  label: string;
  href: string;
  /** Mark this link as currently active */
  active?: boolean;
}

export interface NavbarProps {
  /** Brand name or logo element */
  brand?: React.ReactNode;
  /** Navigation links */
  links?: NavLink[];
  /** Right-side action slot (buttons, avatar, etc.) */
  actions?: React.ReactNode;
  /** Make the bar sticky and add blur on scroll */
  sticky?: boolean;
}

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <svg
    className="h-5 w-5 transition-transform duration-200"
    style={{ transform: open ? 'rotate(90deg)' : 'none' }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    )}
  </svg>
);

export function Navbar({
  brand = 'MyApp',
  links = [],
  actions,
  sticky = true,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!sticky) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sticky]);

  return (
    <header
      className={[
        'z-40 w-full transition-all duration-300',
        sticky ? 'sticky top-0' : 'relative',
        scrolled
          ? 'bg-[hsl(222,28%,8%)]/80 backdrop-blur-xl backdrop-saturate-150 border-b border-white/8 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        {/* Brand */}
        <a
          href="/"
          className="flex items-center gap-2 text-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
        >
          {typeof brand === 'string' ? (
            <span
              className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {brand}
            </span>
          ) : (
            brand
          )}
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                link.active
                  ? 'text-white bg-white/10'
                  : 'text-[hsl(220,12%,65%)] hover:text-white hover:bg-white/6',
              ].join(' ')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">{actions}</div>

        {/* Mobile hamburger */}
        <button
          className={[
            'md:hidden rounded-lg p-1.5',
            'text-[hsl(220,12%,65%)] hover:text-white hover:bg-white/8',
            'transition-all duration-150',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500',
          ].join(' ')}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className={[
            'md:hidden border-t border-white/8',
            'bg-[hsl(222,28%,10%)]/95 backdrop-blur-xl',
            'px-5 py-4 flex flex-col gap-1',
            'animate-slide-down',
          ].join(' ')}
          style={{ animation: 'slideDown 0.2s ease both' }}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={[
                'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                link.active
                  ? 'text-white bg-white/10'
                  : 'text-[hsl(220,12%,65%)] hover:text-white hover:bg-white/6',
              ].join(' ')}
            >
              {link.label}
            </a>
          ))}
          {actions && (
            <div className="flex flex-wrap gap-2 pt-2 mt-1 border-t border-white/8">
              {actions}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </header>
  );
}
