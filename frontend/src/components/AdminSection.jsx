import { useEffect, useState } from 'react';
import { api } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Divider, Field, Result, Section, runRequest } from './Result';

function normalizeUser(row) {
  const userName = row.userName ?? row.UserName ?? '';
  const email = row.email ?? row.Email ?? '';
  const roles = row.roles ?? row.Roles ?? [];
  return {
    userName,
    email,
    roles: Array.isArray(roles) ? roles.join(', ') : String(roles),
  };
}

function UsersTable({ users }) {
  if (!users.length) {
    return <p className="data-table__empty">No users found.</p>;
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((row, i) => {
            const user = normalizeUser(row);
            return (
              <tr key={row.id ?? row.Id ?? i}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.roles}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function AdminSection() {
  const [exerciseId, setExerciseId] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseOut, setExerciseOut] = useState({ data: null, error: null });
  const [exerciseValidationErr, setExerciseValidationErr] = useState(null);

  const [users, setUsers] = useState(null);
  const [usersError, setUsersError] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setUsersLoading(true);
    runRequest(() => api.listAdminUsers()).then((out) => {
      if (cancelled) return;
      setUsersError(out.error);
      setUsers(Array.isArray(out.data) ? out.data : []);
      setUsersLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleAddExercise = () => {
    if (!exerciseName.trim()) { setExerciseValidationErr('Exercise name is required.'); return; }
    setExerciseValidationErr(null);
    runRequest(() => api.createExercise({ name: exerciseName.trim() })).then(setExerciseOut);
  };

  const handleRemoveExercise = () => {
    if (!exerciseId) { setExerciseValidationErr('Exercise ID is required.'); return; }
    setExerciseValidationErr(null);
    runRequest(() => api.deleteExercise(exerciseId)).then(setExerciseOut);
  };

  return (
    <Section title="Admin">
      <h3 className="section-card__subtitle">Exercises</h3>
      <Field label="Exercise name" required>
        <input
          className="field__input"
          value={exerciseName}
          onChange={(e) => { setExerciseName(e.target.value); setExerciseValidationErr(null); }}
        />
      </Field>
      <BtnRow>
        <Button variant="primary" onClick={handleAddExercise}>
          Add exercise
        </Button>
      </BtnRow>

      <Field label="Exercise id" required>
        <input
          className="field__input"
          type="number"
          value={exerciseId}
          onChange={(e) => { setExerciseId(e.target.value); setExerciseValidationErr(null); }}
        />
      </Field>
      <BtnRow>
        <Button variant="danger" onClick={handleRemoveExercise}>
          Remove exercise
        </Button>
      </BtnRow>

      {exerciseValidationErr && <Result error={exerciseValidationErr} />}
      {!exerciseValidationErr && (exerciseOut.data !== null || exerciseOut.error) && (
        <Result data={exerciseOut.data} error={exerciseOut.error} />
      )}

      <Divider />

      <h3 className="section-card__subtitle">Registered users</h3>
      {usersLoading && <p className="data-table__empty">Loading users…</p>}
      {usersError && <Result error={usersError} />}
      {!usersLoading && !usersError && users && <UsersTable users={users} />}
    </Section>
  );
}
