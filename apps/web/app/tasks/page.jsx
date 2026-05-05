'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@repo/ui-components';
import { apiRequest, formatDate, capitalize } from '@repo/utils';

const API_BASE = 'http://localhost:4000/api/tasks';

/* raw fetch for DELETE — API returns 204 No Content */
async function apiDelete(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
}

/* ─── Icons ─────────────────────────────────────────────────────── */
const IcoCheck = () => (
  <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
    <path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoUndo = () => (
  <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
    <path d="M2 8h9a3 3 0 1 1 0 6H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 5L2 8l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
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

/* ─── Skeleton loader ────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="animate-pulse" style={{ height: 90, borderRadius: 10, background: 'hsl(222,25%,16%)', marginBottom: 8 }} />
);

/* ─── Single task card ───────────────────────────────────────────── */
function TaskCard({ task, onToggle, onDelete, toggling, deleting }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'hsl(222,25%,16%)' : 'hsl(222,25%,13%)',
        border: `1px solid ${hovered ? 'hsla(220,100%,60%,0.35)' : 'hsl(222,20%,20%)'}`,
        borderRadius: 10,
        padding: '12px 12px 10px',
        marginBottom: 8,
        transition: 'all 0.2s ease',
        opacity: deleting ? 0.4 : 1,
      }}
    >
      {/* Title row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 4 }}>
        {/* Completion indicator */}
        <div style={{
          width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
          border: task.completed ? 'none' : '2px solid hsl(222,20%,32%)',
          background: task.completed ? 'hsl(158,64%,48%)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s',
        }}>
          {task.completed && (
            <svg viewBox="0 0 10 8" fill="none" width="8" height="8">
              <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        <p style={{
          margin: 0, flex: 1, fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.45,
          color: task.completed ? 'hsl(220,12%,42%)' : 'hsl(0,0%,92%)',
          textDecoration: task.completed ? 'line-through' : 'none',
          transition: 'all 0.25s',
        }}>
          {task.title}
        </p>

        {/* Action buttons — visible on hover */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
          <button
            id={`toggle-${task.id}`}
            onClick={() => onToggle(task)}
            disabled={toggling}
            title={task.completed ? 'Move back to To Do' : 'Mark as Done'}
            style={{
              width: 26, height: 26, borderRadius: 6, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: task.completed ? 'hsla(220,12%,30%,0.6)' : 'hsla(158,64%,50%,0.18)',
              color: task.completed ? 'hsl(220,12%,58%)' : 'hsl(158,64%,55%)',
              transition: 'all 0.15s', opacity: toggling ? 0.5 : 1,
            }}
          >
            {task.completed ? <IcoUndo /> : <IcoCheck />}
          </button>
          <button
            id={`delete-${task.id}`}
            onClick={() => onDelete(task.id)}
            disabled={deleting}
            title="Delete"
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

      {/* Description */}
      {task.description && (
        <p style={{ margin: '0 0 8px 24px', fontSize: '0.75rem', color: 'hsl(220,12%,50%)', lineHeight: 1.5 }}>
          {task.description}
        </p>
      )}

      {/* Footer meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8,
        borderTop: '1px solid hsl(222,20%,18%)', marginLeft: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'hsl(220,12%,44%)' }}>
          <IcoCal />{formatDate(task.createdAt)}
        </div>
        {task.updatedAt !== task.createdAt && (
          <span style={{ fontSize: '0.6rem', color: 'hsl(220,12%,36%)', marginLeft: 'auto' }}>
            edited {formatDate(task.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Kanban column ─────────────────────────────────────────────── */
function Column({ label, dotColor, tasks, loading, onToggle, onDelete, togglingId, deletingId }) {
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
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'hsl(0,0%,88%)', flex: 1 }}>{label}</span>
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, borderRadius: 99, padding: '2px 8px',
          background: `${dotColor}22`, color: dotColor }}>
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      {loading ? (
        <><Skeleton /><Skeleton /></>
      ) : tasks.length === 0 ? (
        <div style={{ padding: '28px 0', textAlign: 'center', fontSize: '0.8125rem', color: 'hsl(220,12%,34%)' }}>
          Nothing here
        </div>
      ) : tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          toggling={togglingId === task.id}
          deleting={deletingId === task.id}
        />
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function TasksPage() {
  const [tasks,      setTasks]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [banner,     setBanner]     = useState('');
  const [titleVal,   setTitleVal]   = useState('');
  const [descVal,    setDescVal]    = useState('');
  const [titleErr,   setTitleErr]   = useState('');
  const [adding,     setAdding]     = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    try {
      setLoading(true);
      const data = await apiRequest(API_BASE);
      setTasks(Array.isArray(data) ? data : []);
    } catch { setBanner('Cannot reach API — is the server running on port 4000?'); }
    finally   { setLoading(false); }
  }

  async function handleAdd() {
    if (!titleVal.trim()) { setTitleErr('Title is required'); return; }
    setTitleErr('');
    try {
      setAdding(true);
      const task = await apiRequest(API_BASE, {
        method: 'POST',
        body: JSON.stringify({ title: capitalize(titleVal.trim()), description: descVal.trim() }),
      });
      setTasks(p => [task, ...p]);
      setTitleVal(''); setDescVal('');
    } catch (e) { setBanner(e.message); }
    finally     { setAdding(false); }
  }

  async function handleToggle(task) {
    try {
      setTogglingId(task.id);
      const updated = await apiRequest(`${API_BASE}/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !task.completed }),
      });
      setTasks(p => p.map(t => t.id === updated.id ? updated : t));
    } catch (e) { setBanner(e.message); }
    finally     { setTogglingId(null); }
  }

  async function handleDelete(id) {
    try {
      setDeletingId(id);
      await apiDelete(id);
      setTasks(p => p.filter(t => t.id !== id));
    } catch (e) { setBanner(e.message); }
    finally     { setDeletingId(null); }
  }

  const active    = tasks.filter(t => !t.completed);
  const done      = tasks.filter(t =>  t.completed);
  const total     = tasks.length;
  const progress  = total ? Math.round((done.length / total) * 100) : 0;

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
            background: 'linear-gradient(135deg, hsl(220,100%,60%), hsl(270,80%,65%))',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 16 16" fill="white" width="14" height="14">
              <path d="M2 4h12M2 8h12M2 12h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'hsl(0,0%,92%)' }}>Task Board</span>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0 8px', flex: 1 }}>
          {[
            { label: 'Dashboard', href: '/',      icon: '⊞', active: false },
            { label: 'Tasks',     href: '/tasks', icon: '✓', active: true  },
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

        {/* Progress */}
        {total > 0 && (
          <div style={{ padding: '14px 16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem',
              color: 'hsl(220,12%,44%)', marginBottom: 5 }}>
              <span>Progress</span><span>{progress}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 99, background: 'hsl(222,25%,18%)' }}>
              <div style={{ height: '100%', borderRadius: 99, width: `${progress}%`,
                background: 'linear-gradient(90deg,hsl(220,100%,60%),hsl(270,80%,65%))',
                transition: 'width 0.55s ease' }} />
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
            Task Manager
          </h1>
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
            {[
              { label: 'Total',  val: total,         color: 'hsl(220,100%,65%)' },
              { label: 'Active', val: active.length, color: 'hsl(38,92%,58%)'   },
              { label: 'Done',   val: done.length,   color: 'hsl(158,64%,52%)'  },
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

          {/* Kanban columns */}
          <div style={{ flex: 1, padding: '20px 16px', overflow: 'auto' }}>

            {/* Error banner */}
            {banner && (
              <div className="animate-scale-in" style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
                borderRadius: 10, padding: '9px 14px', fontSize: '0.8125rem',
                background: 'hsla(0,72%,51%,0.12)', border: '1px solid hsla(0,72%,51%,0.28)',
                color: 'hsl(0,82%,72%)',
              }}>
                <span style={{ flex: 1 }}>{banner}</span>
                <button onClick={() => setBanner('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.7, fontSize: '1rem' }}>✕</button>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'start' }}>
              <Column
                label="To Do"
                dotColor="hsl(220,100%,62%)"
                tasks={active}
                loading={loading}
                onToggle={handleToggle}
                onDelete={handleDelete}
                togglingId={togglingId}
                deletingId={deletingId}
              />
              <Column
                label="Done"
                dotColor="hsl(158,64%,52%)"
                tasks={done}
                loading={loading}
                onToggle={handleToggle}
                onDelete={handleDelete}
                togglingId={togglingId}
                deletingId={deletingId}
              />
            </div>
          </div>

          {/* ── Add Task Panel ── */}
          <aside style={{
            width: 264, flexShrink: 0,
            background: 'hsla(222,28%,7%,0.95)',
            borderLeft: '1px solid hsl(222,20%,13%)',
            padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                background: 'linear-gradient(135deg,hsl(220,100%,60%),hsl(270,80%,65%))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <IcoPlus />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'hsl(0,0%,88%)' }}>Add Task</span>
            </div>

            <Input
              id="task-title-input"
              placeholder="Task title…"
              value={titleVal}
              onChange={e => { setTitleVal(e.target.value); setTitleErr(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              error={titleErr}
              maxLength={120}
              showCount
            />
            <Input
              id="task-desc-input"
              placeholder="Description (optional)"
              value={descVal}
              onChange={e => setDescVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              maxLength={200}
              showCount
            />
            <Button
              id="add-task-btn"
              variant="primary"
              fullWidth
              loading={adding}
              onClick={handleAdd}
            >
              Add Task
            </Button>

            {/* Divider */}
            <div style={{ borderTop: '1px solid hsl(222,20%,16%)', margin: '4px 0' }} />

            {/* Quick stats */}
            <p style={{ margin: 0, fontSize: '0.6875rem', fontWeight: 600, color: 'hsl(220,12%,44%)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Overview
            </p>
            {[
              { label: 'Total tasks',      val: total,           color: 'hsl(220,100%,65%)' },
              { label: 'Active',           val: active.length,   color: 'hsl(38,92%,58%)'   },
              { label: 'Completed',        val: done.length,     color: 'hsl(158,64%,52%)'  },
              { label: 'Completion rate',  val: `${progress}%`,  color: 'hsl(270,80%,70%)'  },
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
