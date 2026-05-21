import { useState } from 'react';
import { api } from '../api';
import { Field, Result, Section, runRequest } from './Result';

export function ExercisesSection() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [out, setOut] = useState({ data: null, error: null });

  return (
    <Section title="Exercises">
      <button type="button" onClick={() => runRequest(() => api.listExercisesPublic()).then(setOut)}>
        GET /api/Exercises/public (no auth)
      </button>
      <button type="button" onClick={() => runRequest(() => api.listExercises()).then(setOut)}>
        GET /api/Exercises
      </button>

      <Field label="id (guid)">
        <input value={id} onChange={(e) => setId(e.target.value)} />
      </Field>
      <button type="button" onClick={() => runRequest(() => api.getExercise(id)).then(setOut)}>
        GET /api/Exercises/{'{id}'}
      </button>

      <Field label="name (admin create)">
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <button type="button" onClick={() => runRequest(() => api.createExercise({ name })).then(setOut)}>
        POST /api/Exercises (Admin)
      </button>
      <button type="button" onClick={() => runRequest(() => api.deleteExercise(id)).then(setOut)}>
        DELETE /api/Exercises/{'{id}'} (Admin)
      </button>

      <Result data={out.data} error={out.error} />
    </Section>
  );
}
