'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Input } from '@repo/ui-components';
import { apiRequest, formatDate, capitalize } from '@repo/utils';

const API_HABITS = 'http://localhost:4000/api/habits';
const API_NOTES  = 'http://localhost:4000/api/notes';

/* raw fetch for DELETE — API returns 204 No Content */
async function apiDelete(url) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
}

/* ─── Icons ─────────────────────────────────────────────────────── */
const IcoTrash = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13">
    <path d="M6 2h4a1 1 0 0 1 1 1v1H5V3a1 1 0 0 1 1-1ZM3 5h10l-1 9H4L3 5Zm3 2v5m4-5v5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);
const IcoCal = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11">
    <path d="M4 1v2M12 1v2M1 6h14M2 3h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);
const IcoPlus = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IcoHabit = () => (
  <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
    <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IcoNote = () => (
  <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
    <path d="M4 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const IcoFire = () => (
  <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
    <path d="M8 1C6 4 4 5 4 8a4 4 0 0 0 8 0c0-3-2-4-4-7Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ─── Error banner ──────────────────────────────────────────────── */
function ErrorBanner({ message, onRetry, onDismiss }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
      borderRadius: 12, padding: '11px 14px', fontSize: '0.8125rem',
      background: 'hsla(0,72%,51%,0.1)', border: '1px solid hsla(0,72%,51%,0.3)',
      color: 'hsl(0,82%,72%)',
    }}>
      <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15" style={{ flexShrink: 0 }}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
      </svg>
      <span style={{ flex: 1 }}>{message}</span>
      {onRetry && (
        <button onClick={onRetry} style={{
          padding: '3px 9px', borderRadius: 6, border: '1px solid hsla(0,72%,51%,0.4)',
          background: 'hsla(0,72%,51%,0.15)', color: 'hsl(0,82%,72%)',
          fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
        }}>Retry</button>
      )}
      <button onClick={onDismiss} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'inherit', opacity: 0.6, fontSize: '1rem', lineHeight: 1, padding: 2,
      }}>✕</button>
    </div>
  );
}

/* ─── Skeleton loader ──────────────────────────────────────────── */
const Skeleton = () => (
  <div className="animate-pulse" style={{ height: 80, borderRadius: 10, background: 'hsl(222,25%,16%)', marginBottom: 8 }} />
);

/* ─── Frequency badge ──────────────────────────────────────────── */
const freqColors = {
  daily:   { bg: 'hsla(158,64%,48%,0.14)', color: 'hsl(158,64%,55%)' },
  weekly:  { bg: 'hsla(220,100%,60%,0.14)', color: 'hsl(220,100%,65%)' },
  monthly: { bg: 'hsla(270,80%,65%,0.14)',  color: 'hsl(270,80%,70%)' },
};

function FreqBadge({ frequency }) {
  const c = freqColors[frequency] || freqColors.daily;
  return (
    <span style={{
      fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.06em', padding: '2px 8px', borderRadius: 99,
      background: c.bg, color: c.color,
    }}>
      {frequency}
    </span>
  );
}

/* ─── Habit card ───────────────────────────────────────────────── */
function HabitCard({ habit, onDelete, deleting }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'hsl(222,25%,16%)' : 'hsl(222,25%,13%)',
        border: `1px solid ${hovered ? 'hsla(158,64%,48%,0.35)' : 'hsl(222,20%,20%)'}`,
        borderRadius: 10,
        padding: '12px 12px 10px',
        marginBottom: 8,
        transition: 'all 0.2s ease',
        opacity: deleting ? 0.4 : 1,
      }}
    >
      {/* Title row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, hsl(158,64%,48%), hsl(170,80%,42%))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
        }}>
          <IcoHabit />
        </div>
        <p style={{
          margin: 0, flex: 1, fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.45,
          color: 'hsl(0,0%,92%)',
        }}>
          {habit.name}
        </p>

        {/* Delete — visible on hover */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
          <button
            id={`delete-habit-${habit.id}`}
            onClick={() => onDelete(habit.id)}
            disabled={deleting}
            title="Delete habit"
            style={{
              width: 26, height: 26, borderRadius: 6, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'hsla(0,72%,51%,0.14)', color: 'hsl(0,72%,65%)',
              transition: 'all 0.15s', opacity: deleting ? 0.5 : 1,
            }}
          >
            <IcoTrash />
          </button>
        </div>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8,
        borderTop: '1px solid hsl(222,20%,18%)', marginLeft: 36 }}>
        <FreqBadge frequency={habit.frequency} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.6875rem', color: 'hsl(38,92%,58%)' }}>
          <IcoFire />{habit.streak} streak
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'hsl(220,12%,44%)', marginLeft: 'auto' }}>
          <IcoCal />{formatDate(habit.createdAt)}
        </div>
      </div>
    </div>
  );
}

/* ─── Note card ────────────────────────────────────────────────── */
function NoteCard({ note, onDelete, deleting }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'hsl(222,25%,16%)' : 'hsl(222,25%,13%)',
        border: `1px solid ${hovered ? 'hsla(270,80%,65%,0.35)' : 'hsl(222,20%,20%)'}`,
        borderRadius: 10,
        padding: '12px 12px 10px',
        marginBottom: 8,
        transition: 'all 0.2s ease',
        opacity: deleting ? 0.4 : 1,
      }}
    >
      {/* Title row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: note.content ? 4 : 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, hsl(270,80%,65%), hsl(300,80%,65%))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
        }}>
          <IcoNote />
        </div>
        <p style={{
          margin: 0, flex: 1, fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.45,
          color: 'hsl(0,0%,92%)',
        }}>
          {note.title}
        </p>

        {/* Delete — visible on hover */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
          <button
            id={`delete-note-${note.id}`}
            onClick={() => onDelete(note.id)}
            disabled={deleting}
            title="Delete note"
            style={{
              width: 26, height: 26, borderRadius: 6, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'hsla(0,72%,51%,0.14)', color: 'hsl(0,72%,65%)',
              transition: 'all 0.15s', opacity: deleting ? 0.5 : 1,
            }}
          >
            <IcoTrash />
          </button>
        </div>
      </div>

      {/* Content preview */}
      {note.content && (
        <p style={{ margin: '0 0 8px 36px', fontSize: '0.75rem', color: 'hsl(220,12%,50%)', lineHeight: 1.5 }}>
          {note.content.length > 120 ? note.content.slice(0, 120) + '…' : note.content}
        </p>
      )}

      {/* Footer meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8,
        borderTop: '1px solid hsl(222,20%,18%)', marginLeft: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'hsl(220,12%,44%)' }}>
          <IcoCal />{formatDate(note.createdAt)}
        </div>
        {note.updatedAt !== note.createdAt && (
          <span style={{ fontSize: '0.6rem', color: 'hsl(220,12%,36%)', marginLeft: 'auto' }}>
            edited {formatDate(note.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── List column ──────────────────────────────────────────────── */
function ListColumn({ label, dotColor, icon, items, loading, renderCard, emptyText }) {
  return (
    <div style={{
      background: 'hsla(222,28%,9%,0.9)',
      border: '1px solid hsl(222,20%,17%)',
      borderRadius: 14, padding: '14px 12px', minWidth: 0, flex: 1,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: dotColor,
          boxShadow: `0 0 7px ${dotColor}`, flexShrink: 0 }} />
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'hsl(0,0%,88%)', flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          {icon}{label}
        </span>
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, borderRadius: 99, padding: '2px 8px',
          background: `${dotColor}22`, color: dotColor }}>
          {items.length}
        </span>
      </div>

      {/* Cards */}
      {loading ? (
        <><Skeleton /><Skeleton /></>
      ) : items.length === 0 ? (
        <div style={{ padding: '28px 0', textAlign: 'center', fontSize: '0.8125rem', color: 'hsl(220,12%,34%)' }}>
          {emptyText}
        </div>
      ) : items.map(item => renderCard(item))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function HabitsPage() {
  const [habits,     setHabits]     = useState([]);
  const [notes,      setNotes]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [banner,     setBanner]     = useState('');

  // Add-form state
  const [addMode,    setAddMode]    = useState('habit'); // 'habit' | 'note'
  const [nameVal,    setNameVal]    = useState('');
  const [freqVal,    setFreqVal]    = useState('daily');
  const [titleVal,   setTitleVal]   = useState('');
  const [contentVal, setContentVal] = useState('');
  const [fieldErr,   setFieldErr]   = useState('');
  const [adding,     setAdding]     = useState(false);

  const [deletingHabitId, setDeletingHabitId] = useState(null);
  const [deletingNoteId,  setDeletingNoteId]  = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setBanner('');
      const [h, n] = await Promise.all([
        apiRequest(API_HABITS),
        apiRequest(API_NOTES),
      ]);
      setHabits(Array.isArray(h) ? h : []);
      setNotes(Array.isArray(n) ? n : []);
    } catch {
      setBanner('Cannot reach API — is the server running on port 4000?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Add Habit ── */
  async function handleAddHabit() {
    if (!nameVal.trim()) { setFieldErr('Name is required'); return; }
    setFieldErr('');
    try {
      setAdding(true);
      const habit = await apiRequest(API_HABITS, {
        method: 'POST',
        body: JSON.stringify({ name: capitalize(nameVal.trim()), frequency: freqVal }),
      });
      setHabits(p => [habit, ...p]);
      setNameVal('');
    } catch (e) { setBanner(e.message); }
    finally     { setAdding(false); }
  }

  /* ── Add Note ── */
  async function handleAddNote() {
    if (!titleVal.trim()) { setFieldErr('Title is required'); return; }
    setFieldErr('');
    try {
      setAdding(true);
      const note = await apiRequest(API_NOTES, {
        method: 'POST',
        body: JSON.stringify({ title: capitalize(titleVal.trim()), content: contentVal.trim() }),
      });
      setNotes(p => [note, ...p]);
      setTitleVal(''); setContentVal('');
    } catch (e) { setBanner(e.message); }
    finally     { setAdding(false); }
  }

  /* ── Delete Habit ── */
  async function handleDeleteHabit(id) {
    try {
      setDeletingHabitId(id);
      await apiDelete(`${API_HABITS}/${id}`);
      setHabits(p => p.filter(h => h.id !== id));
    } catch (e) { setBanner(e.message); }
    finally     { setDeletingHabitId(null); }
  }

  /* ── Delete Note ── */
  async function handleDeleteNote(id) {
    try {
      setDeletingNoteId(id);
      await apiDelete(`${API_NOTES}/${id}`);
      setNotes(p => p.filter(n => n.id !== id));
    } catch (e) { setBanner(e.message); }
    finally     { setDeletingNoteId(null); }
  }

  const totalItems = habits.length + notes.length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'hsl(222,28%,8%)', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 200, flexShrink: 0,
        background: 'hsla(222,30%,6%,0.98)',
        borderRight: '1px solid hsl(222,20%,13%)',
        display: 'flex', flexDirection: 'column', padding: '20px 0',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 16px 20px', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, hsl(158,64%,48%), hsl(170,80%,42%))',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 16 16" fill="white" width="14" height="14">
              <circle cx="8" cy="8" r="5" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M8 5v6M5 8h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'hsl(0,0%,92%)' }}>Tracker</span>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0 8px', flex: 1 }}>
          {[
            { label: 'Dashboard', href: '/',          icon: '⊞', active: false },
            { label: 'Tasks',     href: '/tasks',     icon: '✓', active: false },
            { label: 'Habits',    href: '/habits',    icon: '◉', active: true  },
            { label: 'Schedule',  href: '/schedule',  icon: '📅', active: false },
            { label: 'UI Demo',   href: '/ui-demo',   icon: '⬡', active: false },
          ].map(n => (
            <a key={n.label} href={n.href} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '8px 10px', borderRadius: 9, marginBottom: 2,
              textDecoration: 'none', fontSize: '0.8125rem', fontWeight: n.active ? 600 : 500,
              background: n.active ? 'hsla(158,64%,48%,0.15)' : 'transparent',
              color: n.active ? 'hsl(158,64%,60%)' : 'hsl(220,12%,50%)',
              borderLeft: n.active ? '3px solid hsl(158,64%,48%)' : '3px solid transparent',
            }}>
              <span>{n.icon}</span>{n.label}
            </a>
          ))}
        </nav>

        {/* Summary */}
        {totalItems > 0 && (
          <div style={{ padding: '14px 16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem',
              color: 'hsl(220,12%,44%)', marginBottom: 5 }}>
              <span>Total items</span><span>{totalItems}</span>
            </div>
            <div style={{ height: 4, borderRadius: 99, background: 'hsl(222,25%,18%)' }}>
              <div style={{ height: '100%', borderRadius: 99,
                width: `${habits.length > 0 ? Math.round((habits.length / totalItems) * 100) : 0}%`,
                background: 'linear-gradient(90deg,hsl(158,64%,48%),hsl(170,80%,42%))',
                transition: 'width 0.55s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem',
              color: 'hsl(220,12%,38%)', marginTop: 4 }}>
              <span>{habits.length} habits</span><span>{notes.length} notes</span>
            </div>
          </div>
        )}
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          height: 56, display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px',
          borderBottom: '1px solid hsl(222,20%,13%)',
          background: 'hsla(222,28%,7%,0.85)', backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'hsl(0,0%,92%)' }}>
            Habits & Notes
          </h1>
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', alignItems: 'center' }}>
            {loading && <span className="spinner" />}
            {[
              { label: 'Habits', val: habits.length, color: 'hsl(158,64%,52%)' },
              { label: 'Notes',  val: notes.length,  color: 'hsl(270,80%,70%)' },
              { label: 'Total',  val: totalItems,    color: 'hsl(220,100%,65%)' },
            ].map(c => (
              <div key={c.label} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem',
                background: 'hsl(222,25%,14%)', border: '1px solid hsl(222,20%,20%)',
              }}>
                <span style={{ fontWeight: 700, color: c.color }}>{c.val}</span>
                <span style={{ color: 'hsl(220,12%,50%)' }}>{c.label}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Board area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Columns */}
          <div style={{ flex: 1, padding: '20px 16px', overflow: 'auto' }}>

            {/* Error banner */}
            {banner && (
              <ErrorBanner
                message={banner}
                onRetry={fetchAll}
                onDismiss={() => setBanner('')}
              />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'start' }}>
              {/* Habits column */}
              <ListColumn
                label="Habits"
                dotColor="hsl(158,64%,52%)"
                icon={<span style={{ display: 'flex' }}><IcoHabit /></span>}
                items={habits}
                loading={loading}
                emptyText="No habits yet — start tracking!"
                renderCard={habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onDelete={handleDeleteHabit}
                    deleting={deletingHabitId === habit.id}
                  />
                )}
              />

              {/* Notes column */}
              <ListColumn
                label="Notes"
                dotColor="hsl(270,80%,70%)"
                icon={<span style={{ display: 'flex' }}><IcoNote /></span>}
                items={notes}
                loading={loading}
                emptyText="No notes yet — jot something down!"
                renderCard={note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={handleDeleteNote}
                    deleting={deletingNoteId === note.id}
                  />
                )}
              />
            </div>
          </div>

          {/* ── Add Panel ── */}
          <aside style={{
            width: 264, flexShrink: 0,
            background: 'hsla(222,28%,7%,0.95)',
            borderLeft: '1px solid hsl(222,20%,13%)',
            padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto',
          }}>
            {/* Panel header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                background: addMode === 'habit'
                  ? 'linear-gradient(135deg, hsl(158,64%,48%), hsl(170,80%,42%))'
                  : 'linear-gradient(135deg, hsl(270,80%,65%), hsl(300,80%,65%))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                transition: 'background 0.3s ease',
              }}>
                <IcoPlus />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'hsl(0,0%,88%)' }}>
                {addMode === 'habit' ? 'Add Habit' : 'Add Note'}
              </span>
            </div>

            {/* Mode toggle */}
            <div style={{
              display: 'flex', borderRadius: 10, overflow: 'hidden',
              border: '1px solid hsl(222,20%,20%)', background: 'hsl(222,25%,10%)',
            }}>
              {[
                { key: 'habit', label: 'Habit', color: 'hsl(158,64%,48%)' },
                { key: 'note',  label: 'Note',  color: 'hsl(270,80%,65%)' },
              ].map(m => (
                <button
                  key={m.key}
                  id={`mode-${m.key}`}
                  onClick={() => { setAddMode(m.key); setFieldErr(''); }}
                  style={{
                    flex: 1, padding: '7px 0', border: 'none', cursor: 'pointer',
                    fontSize: '0.75rem', fontWeight: 600,
                    background: addMode === m.key ? `${m.color}20` : 'transparent',
                    color: addMode === m.key ? m.color : 'hsl(220,12%,50%)',
                    borderBottom: addMode === m.key ? `2px solid ${m.color}` : '2px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Add Habit form */}
            {addMode === 'habit' && (
              <>
                <Input
                  id="habit-name-input"
                  placeholder="Habit name…"
                  value={nameVal}
                  onChange={e => { setNameVal(e.target.value); setFieldErr(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleAddHabit()}
                  error={fieldErr}
                  maxLength={80}
                  showCount
                />
                {/* Frequency selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'hsl(220,12%,55%)' }}>
                    Frequency
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['daily', 'weekly', 'monthly'].map(f => (
                      <button
                        key={f}
                        id={`freq-${f}`}
                        onClick={() => setFreqVal(f)}
                        style={{
                          flex: 1, padding: '6px 0', borderRadius: 8, cursor: 'pointer',
                          fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
                          border: freqVal === f ? `1.5px solid ${freqColors[f].color}` : '1.5px solid hsl(222,20%,22%)',
                          background: freqVal === f ? freqColors[f].bg : 'hsl(222,25%,12%)',
                          color: freqVal === f ? freqColors[f].color : 'hsl(220,12%,50%)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  id="add-habit-btn"
                  variant="primary"
                  fullWidth
                  loading={adding}
                  onClick={handleAddHabit}
                >
                  Add Habit
                </Button>
              </>
            )}

            {/* Add Note form */}
            {addMode === 'note' && (
              <>
                <Input
                  id="note-title-input"
                  placeholder="Note title…"
                  value={titleVal}
                  onChange={e => { setTitleVal(e.target.value); setFieldErr(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                  error={fieldErr}
                  maxLength={120}
                  showCount
                />
                <Input
                  id="note-content-input"
                  placeholder="Content (optional)"
                  value={contentVal}
                  onChange={e => setContentVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                  maxLength={500}
                  showCount
                />
                <Button
                  id="add-note-btn"
                  variant="primary"
                  fullWidth
                  loading={adding}
                  onClick={handleAddNote}
                >
                  Add Note
                </Button>
              </>
            )}

            {/* Divider */}
            <div style={{ borderTop: '1px solid hsl(222,20%,16%)', margin: '4px 0' }} />

            {/* Quick stats */}
            <p style={{ margin: 0, fontSize: '0.6875rem', fontWeight: 600, color: 'hsl(220,12%,44%)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Overview
            </p>
            {[
              { label: 'Habits',      val: habits.length, color: 'hsl(158,64%,52%)' },
              { label: 'Notes',       val: notes.length,  color: 'hsl(270,80%,70%)' },
              { label: 'Total items', val: totalItems,    color: 'hsl(220,100%,65%)' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 10px', borderRadius: 8,
                background: 'hsl(222,25%,12%)', border: '1px solid hsl(222,20%,18%)',
                fontSize: '0.8rem',
              }}>
                <span style={{ color: 'hsl(220,12%,54%)' }}>{s.label}</span>
                <span style={{ fontWeight: 700, color: s.color }}>{s.val}</span>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
