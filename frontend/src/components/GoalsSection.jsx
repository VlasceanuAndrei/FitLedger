import { useState } from 'react';
import { api } from '../api';
import { Field, Result, Section, runRequest } from './Result';

export function GoalsSection() {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDateUtc, setTargetDateUtc] = useState('');
  const [out, setOut] = useState({ data: null, error: null });

  const body = () => ({
    title,
    description: description || null,
    targetDateUtc: targetDateUtc || null,
  });

  return (
    <Section title="Goals (authenticated, create only)">
      <button type="button" onClick={() => runRequest(() => api.listGoals()).then(setOut)}>
        GET /api/Goals
      </button>

      <Field label="id (guid)">
        <input value={id} onChange={(e) => setId(e.target.value)} />
      </Field>
      <button type="button" onClick={() => runRequest(() => api.getGoal(id)).then(setOut)}>
        GET /api/Goals/{'{id}'}
      </button>

      <Field label="title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="description">
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <Field label="targetDateUtc (ISO, optional)">
        <input value={targetDateUtc} onChange={(e) => setTargetDateUtc(e.target.value)} placeholder="2026-12-31T00:00:00Z" />
      </Field>
      <button type="button" onClick={() => runRequest(() => api.createGoal(body())).then(setOut)}>
        POST /api/Goals
      </button>

      <Result data={out.data} error={out.error} />
    </Section>
  );
}
