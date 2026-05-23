import { useState } from 'react';
import { api } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, LoginPrompt, Result, Section, runRequest } from './Result';

export function GoalsSection({ isLoggedIn, onLogin, onRegister }) {
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

  if (!isLoggedIn) {
    return (
      <Section title="Goals">
        <LoginPrompt onLogin={onLogin} onRegister={onRegister} />
      </Section>
    );
  }

  return (
    <Section title="Goals">
      <BtnRow>
        <Button variant="secondary" onClick={() => runRequest(() => api.listGoals()).then(setOut)}>
          GET /api/Goals
        </Button>
      </BtnRow>

      <Field label="id (number)">
        <input className="field__input" type="number" value={id} onChange={(e) => setId(e.target.value)} />
      </Field>
      <BtnRow>
        <Button variant="secondary" onClick={() => runRequest(() => api.getGoal(id)).then(setOut)}>
          GET /api/Goals/{'{id}'}
        </Button>
      </BtnRow>

      <Field label="title">
        <input className="field__input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="description">
        <input className="field__input" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <Field label="targetDateUtc (ISO, optional)">
        <input
          className="field__input"
          value={targetDateUtc}
          onChange={(e) => setTargetDateUtc(e.target.value)}
          placeholder="2026-12-31T00:00:00Z"
        />
      </Field>
      <BtnRow>
        <Button variant="primary" onClick={() => runRequest(() => api.createGoal(body())).then(setOut)}>
          POST /api/Goals
        </Button>
      </BtnRow>

      <Result data={out.data} error={out.error} />
    </Section>
  );
}
