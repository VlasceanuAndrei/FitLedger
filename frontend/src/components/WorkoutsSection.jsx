import { useState } from 'react';
import { api, parseIntList } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, LoginPrompt, Result, Section, runRequest } from './Result';

export function WorkoutsSection({ isLoggedIn, onLogin, onRegister }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [exerciseIds, setExerciseIds] = useState('');
  const [out, setOut] = useState({ data: null, error: null });

  const body = () => ({ name, exerciseIds: parseIntList(exerciseIds) });

  if (!isLoggedIn) {
    return (
      <Section title="Workouts">
        <LoginPrompt onLogin={onLogin} onRegister={onRegister} />
      </Section>
    );
  }

  return (
    <Section title="Workouts">
      <BtnRow>
        <Button variant="secondary" onClick={() => runRequest(() => api.listWorkouts()).then(setOut)}>
          GET /api/Workouts
        </Button>
      </BtnRow>

      <Field label="id (number)">
        <input className="field__input" type="number" value={id} onChange={(e) => setId(e.target.value)} />
      </Field>
      <BtnRow>
        <Button variant="secondary" onClick={() => runRequest(() => api.getWorkout(id)).then(setOut)}>
          GET /api/Workouts/{'{id}'}
        </Button>
      </BtnRow>

      <Field label="name">
        <input className="field__input" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="exerciseIds (comma-separated numbers)">
        <input className="field__input" value={exerciseIds} onChange={(e) => setExerciseIds(e.target.value)} />
      </Field>
      <BtnRow>
        <Button variant="primary" onClick={() => runRequest(() => api.createWorkout(body())).then(setOut)}>
          POST /api/Workouts
        </Button>
        <Button variant="neutral" onClick={() => runRequest(() => api.updateWorkout(id, body())).then(setOut)}>
          PUT /api/Workouts/{'{id}'}
        </Button>
        <Button variant="danger" onClick={() => runRequest(() => api.deleteWorkout(id)).then(setOut)}>
          DELETE /api/Workouts/{'{id}'}
        </Button>
      </BtnRow>

      <Result data={out.data} error={out.error} />
    </Section>
  );
}
