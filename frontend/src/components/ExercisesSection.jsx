import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import { Result, runRequest } from './Result';

function ExercisesTable({ exercises, loading }) {
  if (loading) return <p className="data-table__empty">Loading exercises…</p>;
  if (!exercises.length) return <p className="data-table__empty">No exercises found.</p>;

  return (
    <div className="exercises-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex) => (
            <tr key={ex.id ?? ex.Id}>
              <td className="exercises-table__id">{ex.id ?? ex.Id}</td>
              <td>{ex.name ?? ex.Name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ExercisesSection() {
  const [exercises, setExercises] = useState([]);
  const [listError, setListError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    setListError(null);
    const out = await runRequest(() => api.listExercises());
    if (out.error) {
      setListError(out.error);
    } else {
      const sorted = (Array.isArray(out.data) ? out.data : [])
        .slice()
        .sort((a, b) => (a.id ?? a.Id) - (b.id ?? b.Id));
      setExercises(sorted);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchExercises(); }, [fetchExercises]);

  return (
    <section className="section-card exercises-page">
      <h3 className="section-card__subtitle">Exercise catalogue</h3>
      <p className="section-card__hint">Full list of available exercises, sorted by ID.</p>

      {listError && <Result error={listError} />}
      {!listError && <ExercisesTable exercises={exercises} loading={loading} />}
    </section>
  );
}
