import { useState } from 'react';
import { api } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, Result, Section, runRequest } from './Result';

export function ProgressSection() {
  const [id, setId] = useState('');
  const [dateUtc, setDateUtc] = useState('');
  const [metric, setMetric] = useState('');
  const [value, setValue] = useState('');
  const [out, setOut] = useState({ data: null, error: null });

  const body = () => ({
    dateUtc: dateUtc || new Date().toISOString(),
    metric,
    value: Number(value),
  });

  return (
    <Section title="Progress (authenticated, create only)">
      <BtnRow>
        <Button variant="secondary" onClick={() => runRequest(() => api.listProgress()).then(setOut)}>
          GET /api/Progress
        </Button>
      </BtnRow>

      <Field label="id (number)">
        <input className="field__input" type="number" value={id} onChange={(e) => setId(e.target.value)} />
      </Field>
      <BtnRow>
        <Button variant="secondary" onClick={() => runRequest(() => api.getProgress(id)).then(setOut)}>
          GET /api/Progress/{'{id}'}
        </Button>
      </BtnRow>

      <Field label="dateUtc (ISO)">
        <input
          className="field__input"
          value={dateUtc}
          onChange={(e) => setDateUtc(e.target.value)}
          placeholder="2026-05-21T12:00:00Z"
        />
      </Field>
      <Field label="metric">
        <input className="field__input" value={metric} onChange={(e) => setMetric(e.target.value)} />
      </Field>
      <Field label="value (number)">
        <input className="field__input" value={value} onChange={(e) => setValue(e.target.value)} />
      </Field>
      <BtnRow>
        <Button variant="primary" onClick={() => runRequest(() => api.createProgress(body())).then(setOut)}>
          POST /api/Progress
        </Button>
      </BtnRow>

      <Result data={out.data} error={out.error} />
    </Section>
  );
}
