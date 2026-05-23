import { useState } from 'react';
import { api } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, Result, Section, runRequest } from './Result';

export function ExercisesSection() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [out, setOut] = useState({ data: null, error: null });

  return (
    <Section title="Exercises">
      <BtnRow>
        <Button variant="secondary" onClick={() => runRequest(() => api.listExercises()).then(setOut)}>
          GET /api/Exercises
        </Button>
      </BtnRow>

      <Field label="id (number)">
        <input className="field__input" type="number" value={id} onChange={(e) => setId(e.target.value)} />
      </Field>
      <BtnRow>
        <Button variant="secondary" onClick={() => runRequest(() => api.getExercise(id)).then(setOut)}>
          GET /api/Exercises/{'{id}'}
        </Button>
      </BtnRow>

      <Field label="name (admin create)">
        <input className="field__input" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <BtnRow>
        <Button variant="primary" onClick={() => runRequest(() => api.createExercise({ name })).then(setOut)}>
          POST /api/Exercises (Admin)
        </Button>
        <Button variant="danger" onClick={() => runRequest(() => api.deleteExercise(id)).then(setOut)}>
          DELETE /api/Exercises/{'{id}'} (Admin)
        </Button>
      </BtnRow>

      <Result data={out.data} error={out.error} />
    </Section>
  );
}
