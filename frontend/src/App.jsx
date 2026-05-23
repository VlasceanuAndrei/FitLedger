import { useCallback, useEffect, useState } from 'react';
import { api, getToken } from './api';
import { AdminSection } from './components/AdminSection';
import { AuthSection } from './components/AuthSection';
import { ExercisesSection } from './components/ExercisesSection';
import { GoalsSection } from './components/GoalsSection';
import { ProgressSection } from './components/ProgressSection';
import { WorkoutsSection } from './components/WorkoutsSection';

const TABS = ['auth', 'workouts', 'exercises', 'goals', 'progress', 'admin'];

export default function App() {
  const [tab, setTab] = useState('auth');
  const [me, setMe] = useState(null);
  const refreshMe = useCallback(async () => {
    if (!getToken()) { setMe(null); return; }
    try { setMe(await api.me()); } catch { setMe(null); }
  }, []);
  useEffect(() => { refreshMe(); }, [refreshMe]);
  return (
    <div>
      <nav style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderBottom: '1px solid #ccc' }}>
        {TABS.map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            style={{ fontWeight: tab === t ? 'bold' : 'normal', textTransform: 'capitalize' }}>
            {t}
          </button>
        ))}
        {me && <span style={{ marginLeft: 'auto', alignSelf: 'center' }}>Logged in as {me.email}</span>}
      </nav>
      <div style={{ padding: '1rem' }}>
        {tab === 'auth'      && <AuthSection onAuthChange={refreshMe} />}
        {tab === 'workouts'  && <WorkoutsSection />}
        {tab === 'exercises' && <ExercisesSection />}
        {tab === 'goals'     && <GoalsSection />}
        {tab === 'progress'  && <ProgressSection />}
        {tab === 'admin'     && <AdminSection />}
      </div>
    </div>
  );
}
