'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiRequest, formatDate } from '@repo/utils';

const API = {
  tasks:  'http://localhost:4000/api/tasks',
  habits: 'http://localhost:4000/api/habits',
  notes:  'http://localhost:4000/api/notes',
};

/* ─── Sidebar ───────────────────────────────────────────────────── */
function Sidebar() {
  return (
    <aside style={{
      width: 200, flexShrink: 0,
      background: 'hsla(222,30%,6%,0.98)',
      borderRight: '1px solid hsl(222,20%,13%)',
      display: 'flex', flexDirection: 'column', padding: '20px 0',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 16px 24px', display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, hsl(220,100%,60%), hsl(270,80%,65%))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <rect x="2" y="2" width="5" height="5" rx="1.2" fill="white" opacity="0.9"/>
            <rect x="9" y="2" width="5" height="5" rx="1.2" fill="white" opacity="0.6"/>
            <rect x="2" y="9" width="5" height="5" rx="1.2" fill="white" opacity="0.6"/>
            <rect x="9" y="9" width="5" height="5" rx="1.2" fill="white" opacity="0.9"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'hsl(0,0%,92%)' }}>
          Productivity
        </span>
      </div>

      {/* Section label */}
      <p style={{ margin: '0 0 6px', padding: '0 18px', fontSize: '0.625rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.1em', color: 'hsl(220,12%,36%)' }}>
        Navigation
      </p>

      {/* Nav */}
      <nav style={{ padding: '0 8px', flex: 1 }}>
        {[
          { label: 'Dashboard', href: '/',          icon: '⊞', active: true  },
          { label: 'Tasks',     href: '/tasks',     icon: '✓', active: false },
          { label: 'Habits',    href: '/habits',    icon: '◉', active: false },
          { label: 'Schedule',  href: '/schedule',  icon: '📅', active: false },
          { label: 'UI Demo',   href: '/ui-demo',   icon: '⬡', active: false },
        ].map(n => (
          <a key={n.label} href={n.href} style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 10px', borderRadius: 9, marginBottom: 2,
            textDecoration: 'none', fontSize: '0.8125rem', fontWeight: n.active ? 600 : 500,
            background: n.active ? 'hsla(220,100%,60%,0.15)' : 'transparent',
            color: n.active ? 'hsl(220,100%,70%)' : 'hsl(220,12%,50%)',
            borderLeft: n.active ? '3px solid hsl(220,100%,60%)' : '3px solid transparent',
            transition: 'all 0.15s ease',
          }}>
            <span style={{ fontSize: '0.75rem' }}>{n.icon}</span>{n.label}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px 16px 0', borderTop: '1px solid hsl(222,20%,13%)', marginTop: 8 }}>
        <p style={{ margin: 0, fontSize: '0.6rem', color: 'hsl(220,12%,32%)', textAlign: 'center' }}>
          API · localhost:4000
        </p>
      </div>
    </aside>
  );
}

/* ─── Stat card ─────────────────────────────────────────────────── */
function StatCard({ label, value, sub, color, icon, href }) {
  const inner = (
    <div style={{
      background: 'hsl(222,25%,12%)',
      border: `1px solid hsl(222,20%,19%)`,
      borderRadius: 14, padding: '18px 20px',
      display: 'flex', alignItems: 'flex-start', gap: 14,
      transition: 'border-color 0.2s, background 0.2s',
      textDecoration: 'none',
    }}
    onMouseEnter={e => { if (href) { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}0d`; }}}
    onMouseLeave={e => { if (href) { e.currentTarget.style.borderColor = 'hsl(222,20%,19%)'; e.currentTarget.style.background = 'hsl(222,25%,12%)'; }}}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 11, flexShrink: 0,
        background: `${color}1a`, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.25rem',
      }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(0,0%,86%)', marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: '0.7rem', color: 'hsl(220,12%,46%)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
  return href
    ? <a href={href} style={{ display: 'block', textDecoration: 'none' }}>{inner}</a>
    : inner;
}

/* ─── Error banner ──────────────────────────────────────────────── */
function ErrorBanner({ message, onRetry, onDismiss }) {
  return (
    <div style={{
      marginBottom: 20, padding: '12px 16px', borderRadius: 12, fontSize: '0.8125rem',
      background: 'hsla(0,72%,51%,0.1)', border: '1px solid hsla(0,72%,51%,0.3)',
      color: 'hsl(0,82%,72%)', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {/* Icon */}
      <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style={{ flexShrink: 0 }}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
      </svg>
      <span style={{ flex: 1 }}>{message}</span>
      {onRetry && (
        <button onClick={onRetry} style={{
          padding: '4px 10px', borderRadius: 7, border: '1px solid hsla(0,72%,51%,0.4)',
          background: 'hsla(0,72%,51%,0.15)', color: 'hsl(0,82%,72%)',
          fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
        }}>
          Retry
        </button>
      )}
      <button onClick={onDismiss} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'inherit', opacity: 0.6, fontSize: '1rem', lineHeight: 1, padding: 2,
      }}>✕</button>
    </div>
  );
}
function SectionHeader({ title, href, linkLabel }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <h2 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'hsl(0,0%,88%)' }}>{title}</h2>
      {href && (
        <a href={href} style={{ fontSize: '0.75rem', color: 'hsl(220,100%,65%)', textDecoration: 'none' }}>
          {linkLabel || 'View all →'}
        </a>
      )}
    </div>
  );
}

/* ─── Skeleton ──────────────────────────────────────────────────── */
const Skel = ({ h = 60 }) => (
  <div className="animate-pulse" style={{ height: h, borderRadius: 10, background: 'hsl(222,25%,14%)', marginBottom: 8 }} />
);

/* ─── Page ──────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [tasks,  setTasks]  = useState([]);
  const [habits, setHabits] = useState([]);
  const [notes,  setNotes]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setLoading(true);
      const [t, h, n] = await Promise.all([
        apiRequest(API.tasks).catch(() => []),
        apiRequest(API.habits).catch(() => []),
        apiRequest(API.notes).catch(() => []),
      ]);
      setTasks(Array.isArray(t) ? t : []);
      setHabits(Array.isArray(h) ? h : []);
      setNotes(Array.isArray(n) ? n : []);
    } catch {
      setError('Could not connect to the API on port 4000. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* derived */
  const activeTasks    = tasks.filter(t => !t.completed);
  const doneTasks      = tasks.filter(t =>  t.completed);
  const taskProgress   = tasks.length ? Math.round((doneTasks.length / tasks.length) * 100) : 0;
  const recentTasks    = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentNotes    = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
  const topHabits      = [...habits].sort((a, b) => b.streak - a.streak).slice(0, 4);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'hsl(222,28%,8%)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* ── Top bar ── */}
        <header style={{
          height: 60, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px',
          borderBottom: '1px solid hsl(222,20%,13%)',
          background: 'hsla(222,28%,7%,0.9)', backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'hsl(0,0%,92%)' }}>
              Dashboard
            </h1>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220,12%,44%)', marginTop: 1 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 99, fontSize: '0.7rem',
                background: 'hsla(220,100%,60%,0.1)', border: '1px solid hsla(220,100%,60%,0.2)',
                color: 'hsl(220,100%,65%)',
              }}>
                <span className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} />
                Loading…
              </div>
            )}
            <button
              onClick={load}
              disabled={loading}
              title="Refresh data"
              style={{
                width: 32, height: 32, borderRadius: 8, border: '1px solid hsl(222,20%,20%)',
                background: 'hsl(222,25%,14%)', color: 'hsl(220,12%,55%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1,
                transition: 'all 0.15s',
              }}
            >
              <svg viewBox="0 0 16 16" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5c1.8 0 3.4.87 4.4 2.2"/>
                <path d="M13.5 2.5v2.5H11"/>
              </svg>
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>

          {/* Error */}
          {error && (
            <ErrorBanner
              message={error}
              onRetry={load}
              onDismiss={() => setError('')}
            />
          )}

          {/* ── Welcome banner ── */}
          {!loading && !error && (
            <div style={{
              marginBottom: 24, padding: '16px 20px', borderRadius: 14,
              background: 'linear-gradient(135deg, hsla(220,100%,60%,0.1), hsla(270,80%,65%,0.08))',
              border: '1px solid hsla(220,100%,60%,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'hsl(0,0%,92%)' }}>
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋
                </p>
                <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'hsl(220,12%,52%)' }}>
                  {tasks.length === 0 && habits.length === 0
                    ? 'Nothing tracked yet — add a task or habit to get started.'
                    : `You have ${activeTasks.length} active task${activeTasks.length !== 1 ? 's' : ''} and ${habits.length} habit${habits.length !== 1 ? 's' : ''} tracked.`}
                </p>
              </div>
              <a href="/tasks" style={{
                padding: '7px 14px', borderRadius: 9, textDecoration: 'none',
                background: 'hsla(220,100%,60%,0.18)', border: '1px solid hsla(220,100%,60%,0.3)',
                color: 'hsl(220,100%,70%)', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0,
              }}>
                + Add task
              </a>
            </div>
          )}

          {/* ── Stats row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
            {loading ? (
              [1,2,3,4].map(i => <Skel key={i} h={96} />)
            ) : (
              <>
                <StatCard label="Total Tasks"   value={tasks.length}       color="hsl(220,100%,65%)" icon="📋"
                  sub={`${taskProgress}% complete`} href="/tasks" />
                <StatCard label="Active Tasks"  value={activeTasks.length} color="hsl(38,92%,58%)"  icon="⚡"
                  sub={doneTasks.length > 0 ? `${doneTasks.length} done` : 'None done yet'} href="/tasks" />
                <StatCard label="Habits"        value={habits.length}      color="hsl(270,80%,70%)"  icon="🔥"
                  sub={habits.length > 0 ? `Top streak: ${Math.max(...habits.map(h => h.streak), 0)}` : 'No habits yet'} href="/habits" />
                <StatCard label="Notes"         value={notes.length}       color="hsl(158,64%,52%)"  icon="📝"
                  sub="saved notes" href="/habits" />
              </>
            )}
          </div>

          {/* ── Progress bar ── */}
          {tasks.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem',
                color: 'hsl(220,12%,48%)', marginBottom: 6 }}>
                <span>Task completion</span>
                <span>{doneTasks.length} / {tasks.length} tasks done ({taskProgress}%)</span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: 'hsl(222,25%,18%)' }}>
                <div style={{
                  height: '100%', borderRadius: 99, width: `${taskProgress}%`,
                  background: 'linear-gradient(90deg, hsl(220,100%,60%), hsl(270,80%,65%))',
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          )}

          {/* ── Two-col lower section ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Recent Tasks */}
            <div>
              <SectionHeader title="Recent Tasks" href="/tasks" linkLabel="Go to board →" />
              {loading ? (
                <><Skel /><Skel /><Skel /></>
              ) : recentTasks.length === 0 ? (
                <div style={{ padding: '28px 0', textAlign: 'center', fontSize: '0.8125rem', color: 'hsl(220,12%,36%)' }}>
                  No tasks yet — <a href="/tasks" style={{ color: 'hsl(220,100%,62%)', textDecoration: 'none' }}>add one</a>
                </div>
              ) : recentTasks.map(task => (
                <div key={task.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, marginBottom: 6,
                  background: 'hsl(222,25%,12%)', border: '1px solid hsl(222,20%,19%)',
                }}>
                  {/* status dot */}
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: task.completed ? 'hsl(158,64%,52%)' : 'hsl(220,100%,62%)',
                    boxShadow: task.completed ? '0 0 5px hsl(158,64%,52%)' : '0 0 5px hsl(220,100%,62%)',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0, fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.3,
                      color: task.completed ? 'hsl(220,12%,44%)' : 'hsl(0,0%,90%)',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{task.title}</p>
                    <p style={{ margin: 0, fontSize: '0.6875rem', color: 'hsl(220,12%,44%)' }}>
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '0.625rem', fontWeight: 700, borderRadius: 99, padding: '2px 7px',
                    background: task.completed ? 'hsla(158,64%,52%,0.15)' : 'hsla(220,100%,60%,0.15)',
                    color: task.completed ? 'hsl(158,64%,55%)' : 'hsl(220,100%,68%)',
                  }}>
                    {task.completed ? 'Done' : 'Active'}
                  </span>
                </div>
              ))}
            </div>

            {/* Right col: Habits + Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Habits */}
              <div>
                <SectionHeader title="Habits" href="/habits" linkLabel="Manage →" />
                {loading ? (
                  <><Skel /><Skel /></>
                ) : topHabits.length === 0 ? (
                  <div style={{ padding: '20px 0', textAlign: 'center', fontSize: '0.8125rem', color: 'hsl(220,12%,36%)' }}>
                    No habits tracked yet
                  </div>
                ) : topHabits.map(habit => (
                  <div key={habit.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10, marginBottom: 6,
                    background: 'hsl(222,25%,12%)', border: '1px solid hsl(222,20%,19%)',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600,
                        color: 'hsl(0,0%,88%)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {habit.name}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.6875rem', color: 'hsl(220,12%,46%)', textTransform: 'capitalize' }}>
                        {habit.frequency}
                      </p>
                    </div>
                    {/* streak */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'hsl(270,80%,70%)' }}>
                        🔥 {habit.streak}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'hsl(220,12%,44%)' }}>streak</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Notes */}
              <div>
                <SectionHeader title="Recent Notes" href="/habits" linkLabel="All notes →" />
                {loading ? (
                  <><Skel /><Skel /></>
                ) : recentNotes.length === 0 ? (
                  <div style={{ padding: '20px 0', textAlign: 'center', fontSize: '0.8125rem', color: 'hsl(220,12%,36%)' }}>
                    No notes yet
                  </div>
                ) : recentNotes.map(note => (
                  <div key={note.id} style={{
                    padding: '10px 12px', borderRadius: 10, marginBottom: 6,
                    background: 'hsl(222,25%,12%)', border: '1px solid hsl(222,20%,19%)',
                  }}>
                    <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: 'hsl(0,0%,88%)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {note.title}
                    </p>
                    {note.content && (
                      <p style={{ margin: '2px 0 0', fontSize: '0.6875rem', color: 'hsl(220,12%,50%)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {note.content}
                      </p>
                    )}
                    <p style={{ margin: '4px 0 0', fontSize: '0.625rem', color: 'hsl(220,12%,40%)' }}>
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Quick-action nav cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 28 }}>
            {[
              { label: 'Task Board',  desc: 'Manage & complete tasks',   href: '/tasks',    color: 'hsl(220,100%,62%)', icon: '✓'  },
              { label: 'Habits',      desc: 'Track habits & notes',       href: '/habits',   color: 'hsl(158,64%,52%)',  icon: '◉'  },
              { label: 'Schedule',    desc: 'Plan your weekly schedule',  href: '/schedule', color: 'hsl(270,80%,68%)',  icon: '📅' },
              { label: 'UI Demo',     desc: 'Explore component library',  href: '/ui-demo',  color: 'hsl(38,92%,58%)',   icon: '⬡'  },
            ].map(card => (
              <a key={card.label} href={card.href} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 12, textDecoration: 'none',
                background: 'hsl(222,25%,12%)', border: `1px solid hsl(222,20%,19%)`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.background = `${card.color}11`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(222,20%,19%)'; e.currentTarget.style.background = 'hsl(222,25%,12%)'; }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: `${card.color}22`, color: card.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  {card.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'hsl(0,0%,88%)' }}>{card.label}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'hsl(220,12%,48%)' }}>{card.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
