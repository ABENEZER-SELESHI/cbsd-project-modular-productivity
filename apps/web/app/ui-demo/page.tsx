'use client';

import { useState } from 'react';
import { Button, Card, Input, Modal, Navbar } from '@repo/ui-components';

/* ── Icons ─────────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
);
const MailIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const ArrowIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);
const StarIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const PlusIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const EyeIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

/* ── Badge ──────────────────────────────────────────────────────── */
type BadgeColor = 'blue' | 'violet' | 'green' | 'amber' | 'rose';
function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: BadgeColor }) {
  const map: Record<BadgeColor, string> = {
    blue:   'bg-blue-500/15   text-blue-400   border-blue-500/25',
    violet: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
    green:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    amber:  'bg-amber-500/15  text-amber-400  border-amber-500/25',
    rose:   'bg-rose-500/15   text-rose-400   border-rose-500/25',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${map[color]}`}>
      {children}
    </span>
  );
}

/* ── Section divider ────────────────────────────────────────────── */
function SectionLabel({ id, label, count }: { id: string; label: string; count?: string }) {
  return (
    <div id={id} className="flex items-center gap-4 pt-2">
      <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(220,12%,45%)]">{label}</h2>
        {count && <Badge color="blue">{count}</Badge>}
      </div>
      <span className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
    </div>
  );
}

/* ── Sidebar nav item ───────────────────────────────────────────── */
const navItems = [
  { id: 'button', label: 'Button', emoji: '🔘' },
  { id: 'input',  label: 'Input',  emoji: '✏️'  },
  { id: 'card',   label: 'Card',   emoji: '🃏'  },
  { id: 'modal',  label: 'Modal',  emoji: '🪟'  },
  { id: 'navbar', label: 'Navbar', emoji: '🔗'  },
];

/* ── Main page ──────────────────────────────────────────────────── */
export default function UIDemoPage() {
  const [modalOpen,       setModalOpen]       = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [inputValue,      setInputValue]      = useState('');
  const [activeSection,   setActiveSection]   = useState('button');

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen" style={{ background: 'hsl(222,28%,8%)' }}>
      {/* ── Top Navbar ─────────────────────────────────────────── */}
      <Navbar
        brand="DesignKit"
        links={[
          { label: 'Home',    href: '/' },
          { label: 'UI Demo', href: '/ui-demo', active: true },
          { label: 'Docs',    href: '#' },
        ]}
        sticky
        actions={
          <>
            <Button variant="ghost" size="sm">Log in</Button>
            <Button size="sm" rightIcon={<ArrowIcon />}>Get started</Button>
          </>
        }
      />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-4 pt-20 pb-16 text-center">
        {/* Ambient blobs */}
        <div
          className="animate-pulse-glow pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[700px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(220,100%,55%), transparent 65%)' }}
          aria-hidden
        />
        <div
          className="animate-float pointer-events-none absolute top-16 left-16 h-[250px] w-[250px] rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(270,80%,65%), transparent 70%)' }}
          aria-hidden
        />
        <div
          className="animate-float pointer-events-none absolute top-8 right-20 h-[200px] w-[200px] rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(340,80%,65%), transparent 70%)', animationDelay: '3s' }}
          aria-hidden
        />

        <div className="relative">
          <Badge color="violet">Open Source · v2.0</Badge>

          <h1
            className="mt-5 text-5xl md:text-7xl font-black tracking-tight leading-none"
            style={{
              background: 'linear-gradient(135deg, #fff 25%, hsl(220,100%,75%) 60%, hsl(270,80%,75%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Component<br />Library
          </h1>

          <p className="mt-5 max-w-md mx-auto text-lg text-[hsl(220,12%,50%)] leading-relaxed">
            A premium, dark-first UI kit for monorepos.<br />
            Fully typed, accessible, and endlessly composable.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" rightIcon={<ArrowIcon />} onClick={() => scrollTo('button')}>
              Browse components
            </Button>
            <Button size="lg" variant="secondary">View source</Button>
          </div>

          {/* Stats */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-10">
            {[
              { value: '5',    label: 'Components' },
              { value: '100%', label: 'TypeScript'  },
              { value: 'A11y', label: 'Accessible'  },
              { value: '0',    label: 'Dependencies' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-white">{s.value}</div>
                <div className="mt-1 text-xs font-medium text-[hsl(220,12%,45%)] uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + content ────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pb-28 flex gap-8 items-start">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-1 sticky top-20 w-44 shrink-0">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(220,12%,35%)]">Components</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={[
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-left transition-all duration-150',
                activeSection === item.id
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                  : 'text-[hsl(220,12%,55%)] hover:text-white hover:bg-white/5',
              ].join(' ')}
            >
              <span>{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-20">

          {/* ── Button ─────────────────────────────────────────── */}
          <section className="space-y-5">
            <SectionLabel id="button" label="Button" count="5 variants" />

            <Card variant="glass" title="Variants" description="Primary, Secondary, Ghost, Danger, Outline.">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="outline">Outline</Button>
                  <Button disabled>Disabled</Button>
                </div>

                <div className="h-px bg-white/6" />

                <div>
                  <p className="mb-3 text-xs font-medium text-[hsl(220,12%,45%)] uppercase tracking-widest">Sizes</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                <div className="h-px bg-white/6" />

                <div>
                  <p className="mb-3 text-xs font-medium text-[hsl(220,12%,45%)] uppercase tracking-widest">With Icons</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button leftIcon={<PlusIcon />}>Add item</Button>
                    <Button variant="secondary" rightIcon={<ArrowIcon />}>Continue</Button>
                    <Button variant="danger" leftIcon={<TrashIcon />}>Delete</Button>
                    <Button variant="ghost" leftIcon={<StarIcon />}>Star</Button>
                  </div>
                </div>

                <div className="h-px bg-white/6" />

                <div>
                  <p className="mb-3 text-xs font-medium text-[hsl(220,12%,45%)] uppercase tracking-widest">Loading state</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button loading={loading} onClick={simulateLoad}>
                      {loading ? 'Saving…' : 'Click to simulate load'}
                    </Button>
                    <Button variant="secondary" loading={loading}>
                      {loading ? 'Processing…' : 'Secondary load'}
                    </Button>
                  </div>
                </div>

                <div className="h-px bg-white/6" />

                <Button fullWidth leftIcon={<CheckIcon />}>Full-width button</Button>
              </div>
            </Card>
          </section>

          {/* ── Input ──────────────────────────────────────────── */}
          <section className="space-y-5">
            <SectionLabel id="input" label="Input" count="3 states" />

            <div className="grid gap-4 sm:grid-cols-2">
              <Card variant="glass" title="States" description="Default, error, hint, disabled.">
                <div className="space-y-5">
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    leftAdornment={<MailIcon />}
                    hint="We'll never share your email."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Input
                    label="Invalid input"
                    placeholder="bad-value@"
                    defaultValue="bad-value@"
                    error="Please enter a valid email address."
                    leftAdornment={<MailIcon />}
                  />
                  <Input label="Disabled field" placeholder="Can't edit this" disabled />
                </div>
              </Card>

              <Card variant="glass" title="Adornments" description="Left icon, right icon, character counter.">
                <div className="space-y-5">
                  <Input label="Search" placeholder="Search anything…" leftAdornment={<SearchIcon />} />
                  <Input
                    label="Username"
                    placeholder="johndoe"
                    maxLength={20}
                    showCount
                    hint="Max 20 characters."
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    rightAdornment={<EyeIcon />}
                  />
                </div>
              </Card>
            </div>
          </section>

          {/* ── Card ───────────────────────────────────────────── */}
          <section className="space-y-5">
            <SectionLabel id="card" label="Card" count="4 variants" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {([
                { variant: 'default',  badge: <Badge>v1</Badge>,                 label: 'Default',  desc: 'Standard dark surface with subtle border.' },
                { variant: 'glass',    badge: <Badge color="violet">New</Badge>,  label: 'Glass',    desc: 'Frosted glass with blur backdrop.' },
                { variant: 'outline',  badge: <Badge color="amber">Beta</Badge>,  label: 'Outline',  desc: 'Transparent with glowing blue border.' },
                { variant: 'elevated', badge: <Badge color="green">Pro</Badge>,   label: 'Elevated', desc: 'Deep shadow with raised surface feel.' },
              ] as const).map(({ variant, badge, label, desc }) => (
                <Card key={variant} variant={variant} hoverable title={label} titleAdornment={badge}>
                  <p className="text-sm text-[hsl(220,12%,55%)] leading-relaxed">{desc}</p>
                </Card>
              ))}
            </div>

            {/* Feature card */}
            <Card
              variant="glass"
              title="Rich card with footer"
              description="Cards support any content — stats, forms, media — and a sticky action footer."
              titleAdornment={<Badge color="violet">Featured</Badge>}
              footer={
                <>
                  <Button variant="ghost" size="sm">Cancel</Button>
                  <Button size="sm" rightIcon={<CheckIcon />}>Confirm</Button>
                </>
              }
            >
              <div className="grid grid-cols-3 gap-4 py-2">
                {[
                  { label: 'Users',   value: '12.4K', color: 'text-blue-400'    },
                  { label: 'Revenue', value: '$8.2K', color: 'text-violet-400'  },
                  { label: 'Uptime',  value: '99.9%', color: 'text-emerald-400' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white/4 p-4 text-center">
                    <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="mt-1 text-xs text-[hsl(220,12%,50%)]">{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* ── Modal ──────────────────────────────────────────── */}
          <section className="space-y-5">
            <SectionLabel id="modal" label="Modal" count="2 sizes" />

            <Card
              variant="glass"
              title="Modal dialogs"
              description="Scale-in animation, blur backdrop, Escape key and click-outside to close."
            >
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setModalOpen(true)}>Open info modal</Button>
                <Button variant="danger" leftIcon={<TrashIcon />} onClick={() => setDeleteModalOpen(true)}>
                  Confirm delete
                </Button>
              </div>
            </Card>

            {/* Info modal */}
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Welcome to DesignKit 🎉"
              description="A quick tour of what's included."
              size="md"
              footer={
                <>
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>Maybe later</Button>
                  <Button rightIcon={<ArrowIcon />} onClick={() => setModalOpen(false)}>Get started</Button>
                </>
              }
            >
              <ul className="space-y-3 text-sm text-[hsl(220,12%,65%)]">
                {[
                  'Button — 5 variants, 3 sizes, loading & icon slots',
                  'Card — 4 variants, hover lift, header/body/footer',
                  'Input — adornments, error/hint states, char counter',
                  'Modal — size variants, scroll lock, Escape to close',
                  'Navbar — sticky glass, gradient brand, mobile drawer',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0 text-emerald-400"><CheckIcon /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </Modal>

            {/* Delete confirmation modal */}
            <Modal
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              title="Delete item?"
              description="This action is permanent and cannot be undone."
              size="sm"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                  <Button variant="danger" leftIcon={<TrashIcon />} onClick={() => setDeleteModalOpen(false)}>
                    Delete
                  </Button>
                </>
              }
            >
              <p className="text-sm text-[hsl(220,12%,55%)] leading-relaxed">
                You are about to permanently delete <strong className="text-white">Project Alpha</strong>.
                All associated data, settings, and history will be removed immediately.
              </p>
            </Modal>
          </section>

          {/* ── Navbar ─────────────────────────────────────────── */}
          <section className="space-y-5">
            <SectionLabel id="navbar" label="Navbar" />

            <Card variant="glass" title="Navbar" description="The sticky bar at the top of this page demonstrates all Navbar features.">
              <ul className="space-y-2.5 text-sm text-[hsl(220,12%,55%)]">
                {[
                  { icon: '🔗', text: 'Sticky with glass/blur effect on scroll' },
                  { icon: '🎨', text: 'Gradient brand (string or React node)' },
                  { icon: '✅', text: 'Active link highlighting' },
                  { icon: '📱', text: 'Animated mobile drawer (hamburger ↔ ✕)' },
                  { icon: '⚡', text: 'Action slot for buttons or any element' },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5">
                    <span>{icon}</span>{text}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-[hsl(220,12%,38%)]">↑ Resize the window to see the mobile hamburger menu.</p>
            </Card>
          </section>

        </main>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 py-10 text-center">
        <p className="text-sm text-[hsl(220,12%,38%)]">
          Built with{' '}
          <span className="font-semibold" style={{ color: 'hsl(220,100%,65%)' }}>@repo/ui-components</span>
          {' '}— a modular, typed component library.
        </p>
      </footer>
    </div>
  );
}
