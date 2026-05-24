import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import { Button } from './ui/Button';
import { Field, runRequest, validateFields } from './Result';

function norm(obj, key) {
  if (!obj) return undefined;
  return obj[key] !== undefined ? obj[key] : obj[key[0].toUpperCase() + key.slice(1)];
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function GoalsTable({ goals, loading, selectedId, onSelect }) {
  if (loading) return <p className="data-table__empty">Loading goals…</p>;
  if (!goals.length) return <p className="data-table__empty">No goals registered yet.</p>;

  return (
    <div className="workouts-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Target date</th>
            <th>Done</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((g) => {
            const id = norm(g, 'id');
            const isSel = selectedId === id;
            return (
              <tr
                key={id}
                className={`workouts-table__row${isSel ? ' workouts-table__row--selected' : ''}`}
                onClick={() => onSelect(isSel ? null : id)}
              >
                <td className="exercises-table__id">{id}</td>
                <td>{norm(g, 'title')}</td>
                <td>{formatDate(norm(g, 'targetDateUtc'))}</td>
                <td>{norm(g, 'isCompleted') ? '✓' : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GoalDetail({ goal, onToggleComplete, toggling }) {
  if (!goal) return null;
  const done = norm(goal, 'isCompleted');
  const id = norm(goal, 'id');
  return (
    <div className="workout-detail goal-detail">
      <div className="goal-detail__header">
        <p className="workout-detail__name">
          {norm(goal, 'title')}
          <span className="workout-detail__id"> #{id}</span>
        </p>
        <button
          type="button"
          className={`goal-done-btn${done ? ' goal-done-btn--active' : ''}`}
          disabled={toggling}
          onClick={() => onToggleComplete(id, !done)}
        >
          ✓ Done
        </button>
      </div>
      {norm(goal, 'description') && (
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.9375rem' }}>{norm(goal, 'description')}</p>
      )}
      <p className="workout-detail__label">Target date</p>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.9375rem' }}>{formatDate(norm(goal, 'targetDateUtc'))}</p>
      <p className="workout-detail__label">Created</p>
      <p style={{ margin: 0, fontSize: '0.9375rem' }}>{formatDate(norm(goal, 'createdAtUtc'))}</p>
    </div>
  );
}

function Feedback({ success, formError }) {
  if (formError) return <p className="workouts-feedback workouts-feedback--error">{formError}</p>;
  if (success) return <p className="workouts-feedback workouts-feedback--success">{success}</p>;
  return null;
}

export function GoalsSection() {
  const [goals, setGoals] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const [detailData, setDetailData] = useState(null);

  const [createTitle, setCreateTitle] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createDate, setCreateDate] = useState('');
  const [createMsg, setCreateMsg] = useState(null);
  const [createFieldErrors, setCreateFieldErrors] = useState({});
  const [createFormError, setCreateFormError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [togglingComplete, setTogglingComplete] = useState(false);

  const fetchGoals = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    const out = await runRequest(() => api.listGoals());
    if (out.error) {
      setListError(out.error);
    } else {
      setGoals(Array.isArray(out.data) ? out.data : []);
    }
    setListLoading(false);
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const handleSelect = (id) => {
    if (id === null) { setSelectedId(null); setDetailData(null); return; }
    setSelectedId(id);
    const g = goals.find((g) => norm(g, 'id') === id);
    setDetailData(g ?? null);
  };

  const handleToggleComplete = async (id, isCompleted) => {
    setTogglingComplete(true);
    const out = await runRequest(() => api.setGoalCompleted(id, isCompleted));
    if (!out.error) {
      const updated = out.data;
      setGoals((prev) =>
        prev.map((g) => (norm(g, 'id') === id ? updated : g))
      );
      setDetailData(updated);
    }
    setTogglingComplete(false);
  };

  const handleCreate = async () => {
    const errors = validateFields([
      ['title', 'Title is required.', createTitle.trim()],
    ]);
    if (Object.keys(errors).length) {
      setCreateFieldErrors(errors);
      setCreateFormError(null);
      return;
    }
    setCreateFieldErrors({});
    setCreating(true);
    setCreateMsg(null);
    setCreateFormError(null);
    const body = {
      title: createTitle.trim(),
      description: createDesc.trim() || null,
      targetDateUtc: createDate ? new Date(createDate).toISOString() : null,
    };
    const out = await runRequest(() => api.createGoal(body));
    if (out.error) {
      setCreateFormError(out.error);
    } else {
      setCreateMsg(`"${norm(out.data, 'title')}" created successfully.`);
      setCreateTitle('');
      setCreateDesc('');
      setCreateDate('');
      fetchGoals();
    }
    setCreating(false);
  };

  return (
    <div className="workouts-page">
      <section className="section-card">
        <div className="workouts-list-header">
          <div>
            <h2 className="section-card__title">Your Goals</h2>
            {goals.length > 0 && (
              <p className="section-card__hint">Click a row to view its details.</p>
            )}
          </div>
          <Button variant="neutral" onClick={fetchGoals} disabled={listLoading}>
            {listLoading ? 'Loading…' : 'Refresh'}
          </Button>
        </div>

        {listError && <p className="workouts-feedback workouts-feedback--error">{listError}</p>}

        {!listError && (
          <GoalsTable
            goals={goals}
            loading={listLoading}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        )}

        {selectedId !== null && (
          <GoalDetail
            goal={detailData}
            onToggleComplete={handleToggleComplete}
            toggling={togglingComplete}
          />
        )}
      </section>

      <section className="section-card">
        <h2 className="section-card__title">Create Goal</h2>

        <Field label="Title" required error={createFieldErrors.title}>
          <input
            className="field__input"
            placeholder="e.g. Run 5km"
            value={createTitle}
            onChange={(e) => {
              setCreateTitle(e.target.value);
              setCreateFieldErrors((prev) => {
                const next = { ...prev };
                delete next.title;
                return next;
              });
              setCreateFormError(null);
            }}
          />
        </Field>

        <Field label="Description (optional)">
          <input
            className="field__input"
            placeholder="e.g. Complete without stopping"
            value={createDesc}
            onChange={(e) => setCreateDesc(e.target.value)}
          />
        </Field>

        <Field label="Target date (optional)">
          <input
            className="field__input goals-date-input"
            type="date"
            value={createDate}
            onChange={(e) => setCreateDate(e.target.value)}
          />
        </Field>

        <div className="btn-row">
          <Button variant="primary" onClick={handleCreate} disabled={creating}>
            {creating ? 'Creating…' : 'Create Goal'}
          </Button>
        </div>

        <Feedback success={createMsg} formError={createFormError} />
      </section>
    </div>
  );
}
