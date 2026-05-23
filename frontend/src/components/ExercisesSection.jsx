import { useState } from 'react';
import { api } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, LoginPrompt, Result, Section, runRequest } from './Result';

export function ExercisesSection({ isLoggedIn }) {
  const [id, setId] = useState('');
  const [out, setOut] = useState({ data: null, error: null });

  return (
    <Section title="Exercises">
      <BtnRow>
        <Button variant="secondary" onClick={() => runRequest(() => api.listExercises()).then(setOut)}>
          GET /api/Exercises
        </Button>
      </BtnRow>

      {isLoggedIn && (
        <>
          <Field label="id (number)">
            <input className="field__input" type="number" value={id} onChange={(e) => setId(e.target.value)} />
          </Field>
          <BtnRow>
            <Button variant="secondary" onClick={() => runRequest(() => api.getExercise(id)).then(setOut)}>
              GET /api/Exercises/{'{id}'}
            </Button>
          </BtnRow>
        </>
      )}

      <Result data={out.data} error={out.error} />
    </Section>
  );
}
