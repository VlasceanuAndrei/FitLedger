import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import { Button } from './ui/Button';
import { Field, LoginPrompt, Section, runRequest } from './Result';

function norm(obj, key) {
  if (!obj) return undefined;
  return obj[key] !== undefined ? obj[key] : obj[key[0].toUpperCase() + key.slice(1)];
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function ProgressTable({ entries, loading, selectedId, onSelect }) {
  if (loading) return <p className="data-table__empty">Loading progress…</p>;
  if (!entries.length) return <p className="data-table__empty">No progress entries yet.</p>;

  return (
    <div className="workouts-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Metric</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const id = norm(e, 'id');
            const isSel = selectedId === id;
            return (
              <tr
                key={id}
                className={`workouts-table__row${isSel ? ' workouts-table__row--selected' : ''}`}
                onClick={() => onSelect(isSel ? null : id)}
              >
                <td className="exercises-table__id">{id}</td>
                <td>{formatDate(norm(e, 'dateUtc'))}</td>
                <td>{norm(e, 'metric')}</td>
                <td>{norm(e, 'value')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ProgressDetail({ entry }) {
  if (!entry) return null;
  return (
    <div className="workout-detail">
      <p className="workout-detail__name">
        {norm(entry, 'metric')}
        <span className="workout-detail__id"> #{norm(entry, 'id')}</span>
      </p>
      <p className="workout-detail__label">Value</p>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.9375rem' }}>{norm(entry, 'value')}</p>
      <p className="workout-detail__label">Date</p>
      <p style={{ margin: 0, fontSize: '0.9375rem' }}>{formatDate(norm(entry, 'dateUtc'))}</p>
    </div>
  );
}

function Feedback({ success, error }) {
  if (error) return <p className="workouts-feedback workouts-feedback--error">{error}</p>;
  if (success) return <p className="workouts-feedback workouts-feedback--success">{success}</p>;
  return null;
}

export function ProgressSection({ isLoggedIn, onLogin, onRegister }) {
  const [entries, setEntries] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const [detailData, setDetailData] = useState(null);

  const [createDate, setCreateDate] = useState('');
  const [createMetric, setCreateMetric] = useState('');
  const [createValue, setCreateValue] = useState('');
  const [createMsg, setCreateMsg] = useState(null);
  const [createErr, setCreateErr] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchEntries = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    const out = await runRequest(() => api.listProgress());
    if (out.error) {
      setListError(out.error);
    } else {
      setEntries(Array.isArray(out.data) ? out.data : []);
    }
    setListLoading(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchEntries();
  }, [isLoggedIn, fetchEntries]);

  const handleSelect = (id) => {
    if (id === null) { setSelectedId(null); setDetailData(null); return; }
    setSelectedId(id);
    const e = entries.find((e) => norm(e, 'id') === id);
    setDetailData(e ?? null);
  };

  const handleCreate = async () => {
    if (!createMetric.trim()) { setCreateErr('Metric is required.'); return; }
    if (createValue === '' || isNaN(Number(createValue))) { setCreateErr('A numeric value is required.'); return; }
    setCreating(true); setCreateMsg(null); setCreateErr(null);
    const body = {
      dateUtc: createDate ? new Date(createDate).toISOString() : new Date().toISOString(),
      metric: createMetric.trim(),
      value: Number(createValue),
    };
    const out = await runRequest(() => api.createProgress(body));
    if (out.error) {
      setCreateErr(out.error);
    } else {
      setCreateMsg(`"${norm(out.data, 'metric')}" entry created successfully.`);
      setCreateDate('');
      setCreateMetric('');
      setCreateValue('');
      fetchEntries();
    }
    setCreating(false);
  };

  if (!isLoggedIn) {
    return (
      <Section title="Progress">
        <LoginPrompt onLogin={onLogin} onRegister={onRegister} />
      </Section>
    );
  }

  return (
    <div className="workouts-page">
      <section className="section-card">
        <div className="workouts-list-header">
          <div>
            <h2 className="section-card__title">Your Progress</h2>
            {entries.length > 0 && (
              <p className="section-card__hint">Click a row to view its details.</p>
            )}
          </div>
          <Button variant="neutral" onClick={fetchEntries} disabled={listLoading}>
            {listLoading ? 'Loading…' : 'Refresh'}
          </Button>
        </div>

        {listError && <p className="workouts-feedback workouts-feedback--error">{listError}</p>}

        {!listError && (
          <ProgressTable
            entries={entries}
            loading={listLoading}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        )}

        {selectedId !== null && <ProgressDetail entry={detailData} />}
      </section>

      <section className="section-card">
        <h2 className="section-card__title">Log Progress</h2>

        <Field label="Date (optional — defaults to today)">
          <input
            className="field__input goals-date-input"
            type="date"
            value={createDate}
            onChange={(e) => setCreateDate(e.target.value)}
          />
        </Field>

        <Field label="Metric" required>
          <input
            className="field__input"
            placeholder="e.g. Weight (kg)"
            value={createMetric}
            onChange={(e) => { setCreateMetric(e.target.value); setCreateErr(null); }}
          />
        </Field>

        <Field label="Value" required>
          <input
            className="field__input"
            type="number"
            placeholder="e.g. 75.5"
            value={createValue}
            onChange={(e) => { setCreateValue(e.target.value); setCreateErr(null); }}
          />
        </Field>

        <div className="btn-row">
          <Button variant="primary" onClick={handleCreate} disabled={creating}>
            {creating ? 'Logging…' : 'Log Progress'}
          </Button>
        </div>

        <Feedback success={createMsg} error={createErr} />
      </section>
    </div>
  );
}
