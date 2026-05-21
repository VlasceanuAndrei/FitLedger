import { useState } from 'react';
import { api, parseGuidList } from '../api';
import { Field, Result, Section, runRequest } from './Result';

export function WorkoutsSection() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [exerciseIds, setExerciseIds] = useState('');
  const [out, setOut] = useState({ data: null, error: null });

  const body = () => ({ name, exerciseIds: parseGuidList(exerciseIds) });

  return (
    <Section title="Workouts (authenticated)">
      <button type="button" onClick={() => runRequest(() => api.listWorkouts()).then(setOut)}>
        GET /api/Workouts
      </button>

      <Field label="id (guid)">
        <input value={id} onChange={(e) => setId(e.target.value)} />
      </Field>
      <button type="button" onClick={() => runRequest(() => api.getWorkout(id)).then(setOut)}>
        GET /api/Workouts/{'{id}'}
      </button>

      <Field label="name">
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="exerciseIds (comma-separated guids)">
        <input value={exerciseIds} onChange={(e) => setExerciseIds(e.target.value)} />
      </Field>
      <button type="button" onClick={() => runRequest(() => api.createWorkout(body())).then(setOut)}>
        POST /api/Workouts
      </button>
      <button type="button" onClick={() => runRequest(() => api.updateWorkout(id, body())).then(setOut)}>
        PUT /api/Workouts/{'{id}'}
      </button>
      <button type="button" onClick={() => runRequest(() => api.deleteWorkout(id)).then(setOut)}>
        DELETE /api/Workouts/{'{id}'}
      </button>

      <Result data={out.data} error={out.error} />
    </Section>
  );
}
