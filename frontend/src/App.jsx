import { useCallback, useEffect, useState } from 'react';
import { api, getToken } from './api';
import { AdminSection } from './components/AdminSection';
import { AuthSection } from './components/AuthSection';
import { ExercisesSection } from './components/ExercisesSection';
import { GoalsSection } from './components/GoalsSection';
import { ProgressSection } from './components/ProgressSection';
import { WorkoutsSection } from './components/WorkoutsSection';

const TABS = [
  { id: 'auth', label: 'Auth' },
  { id: 'workouts', label: 'Workouts' },
  { id: 'exercises', label: 'Exercises' },
  { id: 'goals', label: 'Goals' },
  { id: 'progress', label: 'Progress' },
  { id: 'admin', label: 'Admin' },
];

export default function App() {
  const [tab, setTab] = useState('auth');
  const [me, setMe] = useState(null);
  const [meError, setMeError] = useState(null);

  const refreshMe = useCallback(async () => {
    if (!getToken()) {
      setMe(null);
      setMeError(null);
      return;
    }
    try {
      setMe(await api.me());
      setMeError(null);
    } catch (e) {
      setMe(null);
      setMeError(e.message);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1rem', maxWidth: '900px' }}>
      <h1>Fitness Tracker</h1>
      {me && (
        <p>
          Signed in as <strong>{me.userName || me.email}</strong> ({me.roles?.join(', ')})
        </p>
      )}
      {meError && <p style={{ color: 'crimson' }}>Session: {meError}</p>}

      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{ fontWeight: tab === t.id ? 'bold' : 'normal' }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'auth' && <AuthSection onAuthChange={refreshMe} />}
      {tab === 'workouts' && <WorkoutsSection />}
      {tab === 'exercises' && <ExercisesSection />}
      {tab === 'goals' && <GoalsSection />}
      {tab === 'progress' && <ProgressSection />}
      {tab === 'admin' && <AdminSection />}
    </div>
  );
}
