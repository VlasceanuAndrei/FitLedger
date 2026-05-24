import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import { Button } from './ui/Button';
import { LoginPrompt, Result, runRequest } from './Result';

function ExercisesTable({ exercises, loading, visible }) {
  if (!visible) return null;
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

export function ExercisesSection({ isLoggedIn, onLogin, onRegister }) {
  const [exercises, setExercises] = useState([]);
  const [listError, setListError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableVisible, setTableVisible] = useState(true);

  const [id, setId] = useState('');
  const [singleResult, setSingleResult] = useState(null);
  const [singleError, setSingleError] = useState(null);

  const handleGetExercise = async () => {
    setSingleResult(null);
    setSingleError(null);
    const out = await runRequest(() => api.getExercise(id));
    if (out.error) setSingleError(out.error);
    else setSingleResult(out.data);
  };

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

      <div className="exercises-page__catalogue">
        <div className="exercises-list-card__header">
          <div>
            <h3 className="section-card__subtitle">Exercise catalogue</h3>
            <p className="section-card__hint">Full list of available exercises, sorted by ID.</p>
          </div>
          <div className="exercises-header-actions">
            <Button variant="neutral" onClick={fetchExercises} disabled={loading}>
              Refresh
            </Button>
            <Button
              variant="neutral"
              onClick={() => setTableVisible((v) => !v)}
            >
              {tableVisible ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>

        {listError && <Result error={listError} />}
        {!listError && (
          <ExercisesTable exercises={exercises} loading={loading} visible={tableVisible} />
        )}
      </div>

      <div className="exercises-page__lookup">
        <hr className="section-card__divider" />

        {isLoggedIn ? (
          <>
            <h3 className="section-card__subtitle">Look up by ID</h3>
            <div className="exercises-lookup-row">
              <input
                className="field__input exercises-lookup-input"
                type="number"
                placeholder="Exercise ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <Button variant="secondary" onClick={handleGetExercise}>
                Get exercise
              </Button>
            </div>
            {singleError && (
              <p className="exercises-lookup-error">{singleError}</p>
            )}
            {singleResult && (
              <div className="exercises-lookup-result">
                <span className="exercises-lookup-result__id">#{singleResult.id ?? singleResult.Id}</span>
                <span className="exercises-lookup-result__name">{singleResult.name ?? singleResult.Name}</span>
              </div>
            )}
          </>
        ) : (
          <LoginPrompt onLogin={onLogin} onRegister={onRegister} />
        )}
      </div>

    </section>
  );
}
