import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api';
import { Button } from './ui/Button';
import { Field, Section, runRequest, validateFields } from './Result';

function norm(obj, key) {
  if (!obj) return undefined;
  return obj[key] !== undefined ? obj[key] : obj[key[0].toUpperCase() + key.slice(1)];
}

function ExercisePicker({ exercises, selected, onChange }) {
  const lastClickedIdx = useRef(null);

  const handleClick = (e, idx) => {
    const id = norm(exercises[idx], 'id');
    if (e.shiftKey && lastClickedIdx.current !== null) {
      const lo = Math.min(lastClickedIdx.current, idx);
      const hi = Math.max(lastClickedIdx.current, idx);
      const rangeIds = exercises.slice(lo, hi + 1).map((ex) => norm(ex, 'id'));
      const allInRange = rangeIds.every((rid) => selected.includes(rid));
      onChange(
        allInRange
          ? selected.filter((s) => !rangeIds.includes(s))
          : [...new Set([...selected, ...rangeIds])]
      );
    } else {
      lastClickedIdx.current = idx;
      onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
    }
  };

  if (!exercises.length) {
    return <p className="data-table__empty">No exercises available.</p>;
  }

  return (
    <div className="workout-exercise-picker" role="listbox" aria-multiselectable="true">
      {exercises.map((ex, idx) => {
        const id = norm(ex, 'id');
        const name = norm(ex, 'name');
        const isSel = selected.includes(id);
        return (
          <div
            key={id}
            role="option"
            aria-selected={isSel}
            className={`workout-exercise-picker__item${isSel ? ' workout-exercise-picker__item--selected' : ''}`}
            onClick={(e) => handleClick(e, idx)}
          >
            <span className="workout-exercise-picker__id">#{id}</span>
            <span>{name}</span>
            {isSel && <span className="workout-exercise-picker__check">✓</span>}
          </div>
        );
      })}
    </div>
  );
}

function WorkoutsTable({ workouts, loading, selectedId, onSelect }) {
  if (loading) return <p className="data-table__empty">Loading workouts…</p>;
  if (!workouts.length) return <p className="data-table__empty">No workouts registered yet.</p>;

  return (
    <div className="workouts-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Exercises</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((w) => {
            const id = norm(w, 'id');
            const name = norm(w, 'name');
            const exIds = norm(w, 'exerciseIds') ?? [];
            const isSel = selectedId === id;
            return (
              <tr
                key={id}
                className={`workouts-table__row${isSel ? ' workouts-table__row--selected' : ''}`}
                onClick={() => onSelect(isSel ? null : id)}
              >
                <td className="exercises-table__id">{id}</td>
                <td>{name}</td>
                <td>
                  {exIds.length > 0 ? (
                    <span className="workouts-table__ex-count">{exIds.length} exercise{exIds.length !== 1 ? 's' : ''}</span>
                  ) : (
                    <span className="workouts-table__none">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function WorkoutDetail({ workout, exercises, loading }) {
  if (loading) return <div className="workout-detail"><p className="data-table__empty">Loading details…</p></div>;
  if (!workout) return null;

  const name = norm(workout, 'name');
  const id = norm(workout, 'id');
  const exIds = norm(workout, 'exerciseIds') ?? [];

  return (
    <div className="workout-detail">
      <p className="workout-detail__name">
        {name}
        <span className="workout-detail__id"> #{id}</span>
      </p>
      <p className="workout-detail__label">Exercises</p>
      {exIds.length === 0 ? (
        <p className="data-table__empty" style={{ marginTop: 0 }}>No exercises in this workout.</p>
      ) : (
        <div className="workout-detail__exercises">
          {exIds.map((exId) => {
            const ex = exercises.find((e) => norm(e, 'id') === exId);
            return (
              <span key={exId} className="workout-detail__ex-badge">
                {ex ? norm(ex, 'name') : `#${exId}`}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Feedback({ success, formError }) {
  if (formError) return <p className="workouts-feedback workouts-feedback--error">{formError}</p>;
  if (success) return <p className="workouts-feedback workouts-feedback--success">{success}</p>;
  return null;
}

function WorkoutSelect({ workouts, value, onChange, placeholder = '— Choose a workout —' }) {
  return (
    <select className="field__input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {workouts.map((w) => {
        const id = norm(w, 'id');
        const name = norm(w, 'name');
        return (
          <option key={id} value={id}>
            #{id} — {name}
          </option>
        );
      })}
    </select>
  );
}

export function WorkoutsSection() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [createName, setCreateName] = useState('');
  const [createExIds, setCreateExIds] = useState([]);
  const [createMsg, setCreateMsg] = useState(null);
  const [createFieldErrors, setCreateFieldErrors] = useState({});
  const [createFormError, setCreateFormError] = useState(null);
  const [creating, setCreating] = useState(false);

  const [updateId, setUpdateId] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateExIds, setUpdateExIds] = useState([]);
  const [updateMsg, setUpdateMsg] = useState(null);
  const [updateFieldErrors, setUpdateFieldErrors] = useState({});
  const [updateFormError, setUpdateFormError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [deleteId, setDeleteId] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [deleteFieldErrors, setDeleteFieldErrors] = useState({});
  const [deleteFormError, setDeleteFormError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchWorkouts = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    const out = await runRequest(() => api.listWorkouts());
    if (out.error) {
      setListError(out.error);
    } else {
      setWorkouts(Array.isArray(out.data) ? out.data : []);
    }
    setListLoading(false);
  }, []);

  const fetchExercises = useCallback(async () => {
    const out = await runRequest(() => api.listExercises());
    if (!out.error) {
      const sorted = (Array.isArray(out.data) ? out.data : [])
        .slice()
        .sort((a, b) => (norm(a, 'id') ?? 0) - (norm(b, 'id') ?? 0));
      setExercises(sorted);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
    fetchExercises();
  }, [fetchWorkouts, fetchExercises]);

  useEffect(() => {
    if (selectedId === null) { setDetailData(null); return; }
    setDetailLoading(true);
    setDetailData(null);
    runRequest(() => api.getWorkout(selectedId)).then((out) => {
      if (!out.error) setDetailData(out.data);
      setDetailLoading(false);
    });
  }, [selectedId]);

  const handleSelectUpdate = (id) => {
    setUpdateId(id);
    setUpdateMsg(null);
    setUpdateFieldErrors({});
    setUpdateFormError(null);
    if (!id) { setUpdateName(''); setUpdateExIds([]); return; }
    const w = workouts.find((w) => String(norm(w, 'id')) === String(id));
    if (w) {
      setUpdateName(norm(w, 'name') ?? '');
      setUpdateExIds(norm(w, 'exerciseIds') ?? []);
    }
  };

  const handleCreate = async () => {
    const errors = validateFields([
      ['name', 'Workout name is required.', createName.trim()],
    ]);
    if (Object.keys(errors).length) {
      setCreateFieldErrors(errors);
      setCreateFormError(null);
      return;
    }
    setCreateFieldErrors({});
    setCreating(true);
    setCreateMsg(null);
    setCreateFormError(null);
    const out = await runRequest(() => api.createWorkout({ name: createName.trim(), exerciseIds: createExIds }));
    if (out.error) {
      setCreateFormError(out.error);
    } else {
      const created = out.data;
      setCreateMsg(`"${norm(created, 'name')}" created successfully.`);
      setCreateName('');
      setCreateExIds([]);
      fetchWorkouts();
    }
    setCreating(false);
  };

  const handleUpdate = async () => {
    const errors = validateFields([
      ['workoutId', 'Select a workout to update.', updateId],
      ['name', 'Workout name is required.', updateName.trim()],
    ]);
    if (Object.keys(errors).length) {
      setUpdateFieldErrors(errors);
      setUpdateFormError(null);
      return;
    }
    setUpdateFieldErrors({});
    setUpdating(true);
    setUpdateMsg(null);
    setUpdateFormError(null);
    const out = await runRequest(() => api.updateWorkout(updateId, { name: updateName.trim(), exerciseIds: updateExIds }));
    if (out.error) {
      setUpdateFormError(out.error);
    } else {
      setUpdateMsg('Workout updated successfully.');
      fetchWorkouts();
      if (selectedId === Number(updateId)) {
        setDetailData(out.data);
      }
    }
    setUpdating(false);
  };

  const handleDeleteSelect = (id) => {
    setDeleteId(id);
    setDeleteConfirm(false);
    setDeleteMsg(null);
    setDeleteFieldErrors({});
    setDeleteFormError(null);
  };

  const handleDelete = async () => {
    const errors = validateFields([
      ['workoutId', 'Select a workout to delete.', deleteId],
    ]);
    if (Object.keys(errors).length) {
      setDeleteFieldErrors(errors);
      setDeleteFormError(null);
      return;
    }
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    setDeleteFieldErrors({});
    setDeleting(true);
    setDeleteMsg(null);
    setDeleteFormError(null);
    const out = await runRequest(() => api.deleteWorkout(deleteId));
    if (out.error) {
      setDeleteFormError(out.error);
    } else {
      setDeleteMsg('Workout deleted successfully.');
      if (selectedId === Number(deleteId)) { setSelectedId(null); setDetailData(null); }
      if (String(updateId) === String(deleteId)) { setUpdateId(''); setUpdateName(''); setUpdateExIds([]); }
      setDeleteId('');
      setDeleteConfirm(false);
      fetchWorkouts();
    }
    setDeleting(false);
  };

  const deleteTarget = workouts.find((w) => String(norm(w, 'id')) === String(deleteId));

  return (
    <div className="workouts-page">
      <section className="section-card">
        <div className="workouts-list-header">
          <div>
            <h2 className="section-card__title">Your Workouts</h2>
            {workouts.length > 0 && (
              <p className="section-card__hint">Click a row to view its details.</p>
            )}
          </div>
          <Button variant="neutral" onClick={fetchWorkouts} disabled={listLoading}>
            {listLoading ? 'Loading…' : 'Refresh'}
          </Button>
        </div>

        {listError && <p className="workouts-feedback workouts-feedback--error">{listError}</p>}

        {!listError && (
          <WorkoutsTable
            workouts={workouts}
            loading={listLoading}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}

        {selectedId !== null && (
          <WorkoutDetail
            workout={detailData}
            exercises={exercises}
            loading={detailLoading}
          />
        )}
      </section>

      <section className="section-card">
        <h2 className="section-card__title">Create Workout</h2>

        <Field label="Workout name" required error={createFieldErrors.name}>
          <input
            className="field__input"
            placeholder="e.g. Morning Push"
            value={createName}
            onChange={(e) => {
              setCreateName(e.target.value);
              setCreateFieldErrors((prev) => {
                const next = { ...prev };
                delete next.name;
                return next;
              });
              setCreateFormError(null);
            }}
          />
        </Field>

        <div className="field">
          <span className="field__label">
            Exercises
            <span className="workout-picker-hint"> — click to select · shift + click for range</span>
          </span>
          <ExercisePicker exercises={exercises} selected={createExIds} onChange={setCreateExIds} />
          {createExIds.length > 0 && (
            <p className="workout-selected-count">
              {createExIds.length} exercise{createExIds.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <div className="btn-row">
          <Button variant="primary" onClick={handleCreate} disabled={creating}>
            {creating ? 'Creating…' : 'Create Workout'}
          </Button>
        </div>

        <Feedback success={createMsg} formError={createFormError} />
      </section>

      <section className="section-card">
        <h2 className="section-card__title">Update Workout</h2>

        <Field label="Select workout" required error={updateFieldErrors.workoutId}>
          <WorkoutSelect
            workouts={workouts}
            value={updateId}
            onChange={(id) => {
              handleSelectUpdate(id);
              setUpdateFieldErrors((prev) => {
                const next = { ...prev };
                delete next.workoutId;
                return next;
              });
            }}
          />
        </Field>

        {updateId && (
          <>
            <Field label="Workout name" required error={updateFieldErrors.name}>
              <input
                className="field__input"
                value={updateName}
                onChange={(e) => {
                  setUpdateName(e.target.value);
                  setUpdateFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.name;
                    return next;
                  });
                  setUpdateFormError(null);
                }}
              />
            </Field>

            <div className="field">
              <span className="field__label">
                Exercises
                <span className="workout-picker-hint"> — click to select · shift + click for range</span>
              </span>
              <ExercisePicker exercises={exercises} selected={updateExIds} onChange={setUpdateExIds} />
              {updateExIds.length > 0 && (
                <p className="workout-selected-count">
                  {updateExIds.length} exercise{updateExIds.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <div className="btn-row">
              <Button variant="neutral" onClick={handleUpdate} disabled={updating}>
                {updating ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </>
        )}

        <Feedback success={updateMsg} formError={updateFormError} />
      </section>

      <section className="section-card">
        <h2 className="section-card__title">Delete Workout</h2>

        <Field label="Select workout" required error={deleteFieldErrors.workoutId}>
          <WorkoutSelect workouts={workouts} value={deleteId} onChange={handleDeleteSelect} />
        </Field>

        {deleteId && !deleteConfirm && (
          <Button variant="danger" onClick={() => setDeleteConfirm(true)}>
            Delete Workout
          </Button>
        )}

        {deleteId && deleteConfirm && (
          <div className="workout-delete-confirm">
            <p className="workout-delete-confirm__msg">
              Are you sure you want to delete{' '}
              <strong>{deleteTarget ? norm(deleteTarget, 'name') : `workout #${deleteId}`}</strong>?
              {' '}This action cannot be undone.
            </p>
            <div className="btn-row">
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Confirm Delete'}
              </Button>
              <Button variant="neutral" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <Feedback success={deleteMsg} formError={deleteFormError} />
      </section>

    </div>
  );
}
