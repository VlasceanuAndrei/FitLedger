import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Divider, Field, Result, Section, runRequest, validateFields } from './Result';

const ROLE_OPTIONS = ['User', 'Admin'];

function normalizeUser(row) {
  return {
    id: row.id ?? row.Id,
    userName: row.userName ?? row.UserName ?? '',
    email: row.email ?? row.Email ?? '',
    role: row.role ?? row.Role ?? 'User',
    isPrimaryAdmin: row.isPrimaryAdmin ?? row.IsPrimaryAdmin ?? false,
  };
}

const MENU_HEIGHT_ESTIMATE = 80;

function UserRoleCell({ userId, role, isPrimaryAdmin, canManage, onChanged }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const handleOpen = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const fitsBelow = rect.bottom + MENU_HEIGHT_ESTIMATE <= window.innerHeight;
      setMenuStyle(
        fitsBelow
          ? { top: rect.bottom + 4, left: rect.left }
          : { bottom: window.innerHeight - rect.top + 4, left: rect.left }
      );
    }
    setOpen((v) => !v);
  };

  const editable = canManage && !isPrimaryAdmin;

  const handleSelect = async (nextRole) => {
    setOpen(false);
    if (nextRole === role || busy) return;
    setBusy(true);
    setError(null);
    const out = await runRequest(() => api.setUserRole(userId, { role: nextRole }));
    setBusy(false);
    if (out.error) {
      setError(out.error);
      return;
    }
    onChanged(out.data);
  };

  if (!editable) {
    return <td>{role}</td>;
  }

  return (
    <td className="role-cell" ref={ref}>
      <button
        type="button"
        className="role-cell__trigger"
        disabled={busy}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={handleOpen}
      >
        {role}
        <span className="role-cell__arrow">▼</span>
      </button>
      {open && (
        <ul className="role-cell__menu" style={menuStyle} role="listbox">
          {ROLE_OPTIONS.map((opt) => {
            const isSel = opt === role;
            return (
              <li
                key={opt}
                role="option"
                aria-selected={isSel}
                className={`role-cell__option${isSel ? ' role-cell__option--selected' : ''}`}
                onClick={() => handleSelect(opt)}
              >
                {opt}
                <span className="role-cell__check">{isSel ? '✓' : ''}</span>
              </li>
            );
          })}
        </ul>
      )}
      {error && <p className="role-cell__error">{error}</p>}
    </td>
  );
}

function UsersTable({ users, canManageRoles, onUserUpdated }) {
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
              <tr key={user.id ?? i}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <UserRoleCell
                  userId={user.id}
                  role={user.role}
                  isPrimaryAdmin={user.isPrimaryAdmin}
                  canManage={canManageRoles}
                  onChanged={onUserUpdated}
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function AdminSection({ canManageRoles = false }) {
  const [exerciseName, setExerciseName] = useState('');
  const [addOut, setAddOut] = useState({ data: null, error: null });
  const [addFieldErrors, setAddFieldErrors] = useState({});
  const [addFormError, setAddFormError] = useState(null);
  const [removeOut, setRemoveOut] = useState({ data: null, error: null });
  const [removeFieldErrors, setRemoveFieldErrors] = useState({});
  const [removeFormError, setRemoveFormError] = useState(null);

  const [exercises, setExercises] = useState([]);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  const [users, setUsers] = useState(null);
  const [usersError, setUsersError] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    const out = await runRequest(() => api.listAdminUsers());
    setUsersError(out.error);
    setUsers(Array.isArray(out.data) ? out.data : []);
    setUsersLoading(false);
  }, []);

  const handleUserUpdated = useCallback((updated) => {
    if (!updated) return;
    const id = updated.id ?? updated.Id;
    setUsers((prev) =>
      (prev ?? []).map((row) => {
        const rowId = row.id ?? row.Id;
        return rowId === id ? updated : row;
      })
    );
  }, []);

  const fetchExercises = useCallback(async () => {
    setExercisesLoading(true);
    const out = await runRequest(() => api.listExercises());
    if (!out.error) {
      const list = (Array.isArray(out.data) ? out.data : []).slice();
      list.sort((a, b) => (a.id ?? a.Id) - (b.id ?? b.Id));
      setExercises(list);
    }
    setExercisesLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => { fetchExercises(); }, [fetchExercises]);

  const handleAddExercise = () => {
    const errors = validateFields([
      ['exerciseName', 'Exercise name is required.', exerciseName.trim()],
    ]);
    if (Object.keys(errors).length) {
      setAddFieldErrors(errors);
      setAddFormError(null);
      return;
    }
    setAddFieldErrors({});
    setAddFormError(null);
    runRequest(() => api.createExercise({ name: exerciseName.trim() })).then((out) => {
      setAddOut(out);
      if (out.error) {
        setAddFormError(out.error);
      } else {
        fetchExercises();
      }
    });
  };

  const handleRemoveExercise = () => {
    const errors = validateFields([
      ['exercise', 'Select an exercise to remove.', selectedExerciseId],
    ]);
    if (Object.keys(errors).length) {
      setRemoveFieldErrors(errors);
      setRemoveFormError(null);
      return;
    }
    setRemoveFieldErrors({});
    setRemoveFormError(null);
    runRequest(() => api.deleteExercise(selectedExerciseId)).then((out) => {
      setRemoveOut(out);
      if (out.error) {
        setRemoveFormError(out.error);
      } else {
        setSelectedExerciseId(null);
        fetchExercises();
      }
    });
  };

  return (
    <Section title="Admin">
      <h3 className="section-card__subtitle">Exercises</h3>
      <Field label="Exercise name" required error={addFieldErrors.exerciseName}>
        <input
          className="field__input"
          value={exerciseName}
          onChange={(e) => {
            setExerciseName(e.target.value);
            setAddFieldErrors((prev) => {
              const next = { ...prev };
              delete next.exerciseName;
              return next;
            });
            setAddFormError(null);
          }}
        />
      </Field>
      <BtnRow>
        <Button variant="primary" onClick={handleAddExercise}>
          Add exercise
        </Button>
      </BtnRow>
      {(addFormError || addOut.data) && (
        <div className="exercise-add-feedback">
          {addFormError && <Result error={addFormError} />}
          {!addFormError && addOut.data && (
            <p className="workouts-feedback workouts-feedback--success">
              Exercise: {addOut.data.name ?? addOut.data.Name} (ID: {addOut.data.id ?? addOut.data.Id}) successfully added.
            </p>
          )}
        </div>
      )}

      <Field label="Exercise to remove" required error={removeFieldErrors.exercise}>
        {exercisesLoading && <p className="data-table__empty">Loading exercises…</p>}
        {!exercisesLoading && !exercises.length && (
          <p className="data-table__empty">No exercises available.</p>
        )}
        {!exercisesLoading && exercises.length > 0 && (
          <div className="workout-exercise-picker" role="listbox" aria-multiselectable="false">
            {exercises.map((ex) => {
              const id = ex.id ?? ex.Id;
              const name = ex.name ?? ex.Name;
              const isSel = selectedExerciseId === id;
              return (
                <div
                  key={id}
                  role="option"
                  aria-selected={isSel}
                  className={`workout-exercise-picker__item${isSel ? ' workout-exercise-picker__item--selected' : ''}`}
                  onClick={() => {
                    setSelectedExerciseId(isSel ? null : id);
                    setRemoveFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.exercise;
                      return next;
                    });
                    setRemoveFormError(null);
                  }}
                >
                  <span className="workout-exercise-picker__id">#{id}</span>
                  <span>{name}</span>
                  {isSel && <span className="workout-exercise-picker__check">✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </Field>
      <BtnRow>
        <Button variant="danger" onClick={handleRemoveExercise}>
          Remove exercise
        </Button>
      </BtnRow>

      {removeFormError && <Result error={removeFormError} />}
      {!removeFormError && removeOut.data !== null && (
        <Result data={removeOut.data} />
      )}

      <Divider />

      <h3 className="section-card__subtitle">Registered users</h3>
      {usersLoading && <p className="data-table__empty">Loading users…</p>}
      {usersError && <Result error={usersError} />}
      {!usersLoading && !usersError && users && (
        <UsersTable
          users={users}
          canManageRoles={canManageRoles}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </Section>
  );
}
