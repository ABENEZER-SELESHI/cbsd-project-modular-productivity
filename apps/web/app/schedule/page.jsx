'use client';

import { useState } from 'react';
import { Button, Input } from '@repo/ui-components';

/* ─── Constants ─────────────────────────────────────────────────── */
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 – 21:00

const TASK_TYPES = [
  { key: 'task',    label: 'Task',    color: 'hsl(220,100%,62%)', bg: 'hsla(220,100%,62%,0.15)' },
  { key: 'habit',   label: 'Habit',   color: 'hsl(158,64%,52%)',  bg: 'hsla(158,64%,52%,0.15)'  },
  { key: 'meeting', label: 'Meeting', color: 'hsl(38,92%,58%)',   bg: 'hsla(38,92%,58%,0.15)'   },
  { key: 'focus',   label: 'Focus',   color: 'hsl(270,80%,70%)',  bg: 'hsla(270,80%,70%,0.15)'  },
  { key: 'break',   label: 'Break',   color: 'hsl(0,0%,52%)',     bg: 'hsla(0,0%,52%,0.12)'     },
];

const TYPE_MAP = Object.fromEntries(TASK_TYPES.map(t => [t.key, t]));

function fmt(h) {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

const todayIdx = (() => {
  const d = new Date().getDay(); // 0=Sun
  return d === 0 ? 6 : d - 1;   // map to Mon=0
})();

/* ─── Sidebar ───────────────────────────────────────────────────── */
function Sidebar() {
  return (
    <aside style={{
      width: 200, flexShrink: 0,
      background: 'hsla(222,30%,6%,0.98)',
      borderRight: '1px solid hsl(222,20%,13%)',
      display: 'flex', flexDirection: 'column', padding: '20px 0',
    }}>
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
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'hsl(0,0%,92%)' }}>Productivity</span>
      </div>

      <p style={{ margin: '0 0 6px', padding: '0 18px', fontSize: '0.625rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.1em', color: 'hsl(220,12%,36%)' }}>
        Navigation
      </p>

      <nav style={{ padding: '0 8px', flex: 1 }}>
        {[
          { label: 'Dashboard', href: '/',          icon: '⊞', active: false },
          { label: 'Tasks',     href: '/tasks',     icon: '✓', active: false },
          { label: 'Habits',    href: '/habits',    icon: '◉', active: false },
          { label: 'Schedule',  href: '/schedule',  icon: '📅', active: true  },
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

      <div style={{ padding: '14px 16px 0', borderTop: '1px solid hsl(222,20%,13%)', marginTop: 8 }}>
        <p style={{ margin: 0, fontSize: '0.6rem', color: 'hsl(220,12%,32%)', textAlign: 'center' }}>
          API · localhost:4000
        </p>
      </div>
    </aside>
  );
}

/* ─── Add-entry modal ───────────────────────────────────────────── */
function AddModal({ slot, onSave, onClose }) {
  const [title,    setTitle]    = useState('');
  const [type,     setType]     = useState('task');
  const [duration, setDuration] = useState(1);
  const [err,      setErr]      = useState('');

  function save() {
    if (!title.trim()) { setErr('Title is required'); return; }
    onSave({ title: title.trim(), type, duration: Number(duration) });
  }

  const cfg = TYPE_MAP[type];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 400, borderRadius: 16,
        background: 'hsl(222,25%,12%)', border: '1px solid hsl(222,20%,22%)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        animation: 'scaleIn 0.22s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid hsl(222,20%,18%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'hsl(0,0%,92%)' }}>
              Add to Schedule
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'hsl(220,12%,48%)' }}>
              {slot.day} · {fmt(slot.hour)}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'hsl(220,12%,50%)', fontSize: '1.1rem', lineHeight: 1, padding: 4,
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Title"
            placeholder="What are you doing?"
            value={title}
            onChange={e => { setTitle(e.target.value); setErr(''); }}
            onKeyDown={e => e.key === 'Enter' && save()}
            error={err}
            maxLength={80}
            showCount
            autoFocus
          />

          {/* Type selector */}
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '0.8rem', fontWeight: 500, color: 'hsl(220,12%,55%)' }}>
              Type
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TASK_TYPES.map(t => (
                <button key={t.key} onClick={() => setType(t.key)} style={{
                  padding: '5px 12px', borderRadius: 99, cursor: 'pointer',
                  fontSize: '0.75rem', fontWeight: 600,
                  border: type === t.key ? `1.5px solid ${t.color}` : '1.5px solid hsl(222,20%,22%)',
                  background: type === t.key ? t.bg : 'hsl(222,25%,10%)',
                  color: type === t.key ? t.color : 'hsl(220,12%,50%)',
                  transition: 'all 0.15s',
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '0.8rem', fontWeight: 500, color: 'hsl(220,12%,55%)' }}>
              Duration
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4].map(h => (
                <button key={h} onClick={() => setDuration(h)} style={{
                  flex: 1, padding: '6px 0', borderRadius: 8, cursor: 'pointer',
                  fontSize: '0.75rem', fontWeight: 600,
                  border: duration === h ? `1.5px solid ${cfg.color}` : '1.5px solid hsl(222,20%,22%)',
                  background: duration === h ? cfg.bg : 'hsl(222,25%,10%)',
                  color: duration === h ? cfg.color : 'hsl(220,12%,50%)',
                  transition: 'all 0.15s',
                }}>{h}h</button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px', borderTop: '1px solid hsl(222,20%,18%)',
          display: 'flex', gap: 8, justifyContent: 'flex-end',
          background: 'hsla(222,25%,10%,0.5)',
        }}>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={save}>Add entry</Button>
        </div>
      </div>
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  );
}

/* ─── Schedule entry block ──────────────────────────────────────── */
function EntryBlock({ entry, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const cfg = TYPE_MAP[entry.type] || TYPE_MAP.task;
  const ROW_H = 56; // px per hour row

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: 2, left: 2, right: 2,
        height: entry.duration * ROW_H - 4,
        borderRadius: 8,
        background: cfg.bg,
        border: `1px solid ${cfg.color}55`,
        padding: '5px 8px',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.15s',
        borderColor: hovered ? cfg.color : `${cfg.color}55`,
        zIndex: 2,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0, fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.3,
            color: cfg.color,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{entry.title}</p>
          {entry.duration > 1 && (
            <p style={{ margin: '2px 0 0', fontSize: '0.625rem', color: 'hsl(220,12%,50%)' }}>
              {entry.duration}h · {cfg.label}
            </p>
          )}
          {entry.duration === 1 && (
            <p style={{ margin: '1px 0 0', fontSize: '0.625rem', color: 'hsl(220,12%,50%)' }}>
              {cfg.label}
            </p>
          )}
        </div>
        {hovered && (
          <button onClick={() => onDelete(entry.id)} style={{
            flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
            color: 'hsl(0,72%,65%)', fontSize: '0.75rem', lineHeight: 1, padding: 1,
            opacity: 0.8,
          }}>✕</button>
        )}
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function SchedulePage() {
  const [entries,    setEntries]    = useState([]);
  const [modal,      setModal]      = useState(null); // { day, hour }
  const [activeDay,  setActiveDay]  = useState(todayIdx);

  function openModal(day, hour) { setModal({ day, hour }); }
  function closeModal()         { setModal(null); }

  function addEntry({ title, type, duration }) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setEntries(prev => [...prev, { id, day: modal.day, hour: modal.hour, title, type, duration }]);
    closeModal();
  }

  function deleteEntry(id) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  const ROW_H = 56;

  /* entries for the active day, keyed by start hour */
  const dayEntries = entries.filter(e => e.day === DAYS[activeDay]);
  /* set of hours that are "occupied" (to skip rendering + button in those rows) */
  const occupiedHours = new Set(
    dayEntries.flatMap(e => Array.from({ length: e.duration }, (_, i) => e.hour + i))
  );

  /* count per day for the day-tab badges */
  const countByDay = DAYS.map(d => entries.filter(e => e.day === d).length);

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: 'hsl(222,28%,8%)', fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Top bar ── */}
        <header style={{
          height: 56, display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px',
          borderBottom: '1px solid hsl(222,20%,13%)',
          background: 'hsla(222,28%,7%,0.9)', backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'hsl(0,0%,92%)' }}>
              Weekly Schedule
            </h1>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220,12%,44%)', marginTop: 1 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{
              padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem',
              background: 'hsl(222,25%,14%)', border: '1px solid hsl(222,20%,20%)',
              color: 'hsl(220,12%,55%)',
            }}>
              <span style={{ fontWeight: 700, color: 'hsl(220,100%,65%)' }}>{entries.length}</span>
              {' '}entries
            </span>
          </div>
        </header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* ── Day tabs ── */}
          <div style={{
            display: 'flex', gap: 4, padding: '12px 20px 0',
            borderBottom: '1px solid hsl(222,20%,13%)',
            background: 'hsla(222,28%,8%,0.95)',
            overflowX: 'auto',
          }}>
            {DAYS.map((day, i) => {
              const isToday   = i === todayIdx;
              const isActive  = i === activeDay;
              return (
                <button key={day} onClick={() => setActiveDay(i)} style={{
                  flexShrink: 0,
                  padding: '8px 14px', borderRadius: '10px 10px 0 0',
                  border: 'none', cursor: 'pointer',
                  fontSize: '0.8125rem', fontWeight: isActive ? 700 : 500,
                  background: isActive ? 'hsl(222,25%,14%)' : 'transparent',
                  color: isActive ? 'hsl(0,0%,92%)' : 'hsl(220,12%,48%)',
                  borderBottom: isActive ? '2px solid hsl(220,100%,62%)' : '2px solid transparent',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span>{day.slice(0, 3)}</span>
                  {isToday && (
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'hsl(220,100%,62%)',
                      boxShadow: '0 0 5px hsl(220,100%,62%)',
                    }} />
                  )}
                  {countByDay[i] > 0 && (
                    <span style={{
                      fontSize: '0.625rem', fontWeight: 700, borderRadius: 99,
                      padding: '1px 5px',
                      background: isActive ? 'hsla(220,100%,62%,0.2)' : 'hsl(222,25%,18%)',
                      color: isActive ? 'hsl(220,100%,68%)' : 'hsl(220,12%,50%)',
                    }}>{countByDay[i]}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Time grid ── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 32px' }}>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              {TASK_TYPES.map(t => (
                <span key={t.key} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: '0.6875rem', fontWeight: 600, color: t.color,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: 2,
                    background: t.color, opacity: 0.8,
                  }} />
                  {t.label}
                </span>
              ))}
              <span style={{ fontSize: '0.6875rem', color: 'hsl(220,12%,36%)', marginLeft: 'auto' }}>
                Click any row to add an entry
              </span>
            </div>

            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '52px 1fr',
              border: '1px solid hsl(222,20%,16%)',
              borderRadius: 12, overflow: 'hidden',
            }}>
              {HOURS.map((hour, idx) => {
                const isOccupied = occupiedHours.has(hour);
                const entryHere  = dayEntries.find(e => e.hour === hour);
                const isFirst    = idx === 0;

                return (
                  <div key={hour} style={{ display: 'contents' }}>
                    {/* Time label */}
                    <div style={{
                      height: ROW_H,
                      display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
                      paddingRight: 10, paddingTop: 6,
                      background: 'hsl(222,25%,10%)',
                      borderTop: isFirst ? 'none' : '1px solid hsl(222,20%,14%)',
                      fontSize: '0.6875rem', fontWeight: 600,
                      color: hour === new Date().getHours() && activeDay === todayIdx
                        ? 'hsl(220,100%,65%)'
                        : 'hsl(220,12%,40%)',
                    }}>
                      {fmt(hour)}
                    </div>

                    {/* Cell */}
                    <div
                      onClick={() => !isOccupied && openModal(DAYS[activeDay], hour)}
                      style={{
                        height: ROW_H, position: 'relative',
                        borderTop: isFirst ? 'none' : '1px solid hsl(222,20%,14%)',
                        borderLeft: '1px solid hsl(222,20%,16%)',
                        background: hour === new Date().getHours() && activeDay === todayIdx
                          ? 'hsla(220,100%,60%,0.04)'
                          : 'transparent',
                        cursor: isOccupied ? 'default' : 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (!isOccupied) e.currentTarget.style.background = 'hsla(220,100%,60%,0.06)'; }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background =
                          hour === new Date().getHours() && activeDay === todayIdx
                            ? 'hsla(220,100%,60%,0.04)' : 'transparent';
                      }}
                    >
                      {/* "+" hint on hover — shown via CSS trick with a pseudo-like span */}
                      {!isOccupied && (
                        <span style={{
                          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                          fontSize: '0.7rem', color: 'hsl(220,12%,30%)',
                          pointerEvents: 'none', userSelect: 'none',
                        }}>+ add</span>
                      )}

                      {/* Entry block */}
                      {entryHere && (
                        <EntryBlock entry={entryHere} onDelete={deleteEntry} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state */}
            {dayEntries.length === 0 && (
              <div style={{
                marginTop: 20, padding: '24px', borderRadius: 12, textAlign: 'center',
                background: 'hsl(222,25%,11%)', border: '1px dashed hsl(222,20%,20%)',
              }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'hsl(220,12%,40%)' }}>
                  No entries for {DAYS[activeDay]} yet
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'hsl(220,12%,32%)' }}>
                  Click any time slot above to add one
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Add modal ── */}
      {modal && (
        <AddModal slot={modal} onSave={addEntry} onClose={closeModal} />
      )}
    </div>
  );
}
