'use client';

import { useState, useEffect } from 'react';
import { Card } from '@repo/ui-components';
import { apiRequest, formatDate } from '@repo/utils';

const API = {
  tasks:  'http://localhost:4000/api/tasks',
  habits: 'http://localhost:4000/api/habits',
  notes:  'http://localhost:4000/api/notes',
};

/* ─── Shared sidebar (mirrors tasks page) ───────────────────────── */
function Sidebar() {
  return (
    <aside style={{
      width: 200, flexShrink: 0,
      background: 'hsla(222,30%,6%,0.98)',
      borderRight: '1px solid hsl(222,20%,13%)',
      display: 'flex', flexDirection: 'column', padding: '20px 0',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 16px 20px', display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, hsl(220,100%,60%), hsl(270,80%,65%))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 16 16" fill="white" width="14" height="14">
            <path d="M2 4h12M2 8h12M2 12h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'hsl(0,0%,92%)' }}>Task Board</span>
      </div>

      {/* Nav */}
      <nav style={{ padding: '0 8px', flex: 1 }}>
        {[
          { label: 'Dashboard', href: '/',      icon: '⊞', active: true  },
          { label: 'Tasks',     href: '/tasks', icon: '✓', active: false },
        ].map(n => (
          <a key={n.label} href={n.href} style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 10px', borderRadius: 9, marginBottom: 2,
            textDecoration: 'none', fontSize: '0.8125rem', fontWeight: n.active ? 600 : 500,
            background: n.active ? 'hsla(220,100%,60%,0.15)' : 'transparent',
            color: n.active ? 'hsl(220,100%,70%)' : 'hsl(220,12%,50%)',
            borderLeft: n.active ? '3px solid hsl(220,100%,60%)' : '3px solid transparent',
          }}>
            <span>{n.icon}</span>{n.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

/* ─── Stat card ─────────────────────────────────────────────────── */
function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background: 'hsl(222,25%,12%)',
      border: '1px solid hsl(222,20%,19%)',
      borderRadius: 14, padding: '18px 20px',
      display: 'flex', alignItems: 'flex-start', gap: 14,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: `${color}22`, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem',
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: '1.625rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(0,0%,86%)', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: '0.7rem', color: 'hsl(220,12%,48%)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ─── Section header ────────────────────────────────────────────── */
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

  useEffect(() => {
    async function load() {
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
        setError('Could not connect to API on port 4000.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
          height: 56, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px',
          borderBottom: '1px solid hsl(222,20%,13%)',
          background: 'hsla(222,28%,7%,0.85)', backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'hsl(0,0%,92%)' }}>
              Dashboard
            </h1>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
            {/* refresh dot */}
            {loading && (
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'hsl(220,100%,62%)',
                display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
            )}
            <span style={{ fontSize: '0.75rem', color: 'hsl(220,12%,46%)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* ── Body ── */}
        <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: 20, padding: '10px 14px', borderRadius: 10, fontSize: '0.8125rem',
              background: 'hsla(0,72%,51%,0.12)', border: '1px solid hsla(0,72%,51%,0.28)',
              color: 'hsl(0,82%,72%)',
            }}>
              {error}
            </div>
          )}

          {/* ── Stats row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
            {loading ? (
              [1,2,3,4].map(i => <Skel key={i} h={96} />)
            ) : (
              <>
                <StatCard label="Total Tasks"   value={tasks.length}    color="hsl(220,100%,65%)" icon="📋"
                  sub={`${taskProgress}% complete`} />
                <StatCard label="Active Tasks"  value={activeTasks.length}  color="hsl(38,92%,58%)"  icon="⚡"
                  sub={doneTasks.length > 0 ? `${doneTasks.length} done` : 'None done yet'} />
                <StatCard label="Habits"        value={habits.length}   color="hsl(270,80%,70%)"  icon="🔥"
                  sub={habits.length > 0 ? `Top streak: ${Math.max(...habits.map(h => h.streak), 0)}` : 'No habits yet'} />
                <StatCard label="Notes"         value={notes.length}    color="hsl(158,64%,52%)"  icon="📝"
                  sub="saved notes" />
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
                <SectionHeader title="Habits" />
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
                <SectionHeader title="Recent Notes" />
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 28 }}>
            {[
              { label: 'Task Board',  desc: 'Manage & complete tasks',   href: '/tasks',   color: 'hsl(220,100%,62%)', icon: '✓' },
              { label: 'UI Demo',     desc: 'Explore component library',  href: '/ui-demo', color: 'hsl(270,80%,68%)',  icon: '⬡' },
              { label: 'API Health',  desc: 'localhost:4000/health',      href: 'http://localhost:4000/health', color: 'hsl(158,64%,52%)', icon: '♥' },
            ].map(card => (
              <a key={card.label} href={card.href} target={card.href.startsWith('http://localhost:4000') ? '_blank' : '_self'} style={{
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
