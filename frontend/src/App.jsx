import { useCallback, useEffect, useState } from 'react';
import { api, clearToken, getToken } from './api';
import { AdminSection } from './components/AdminSection';
import { ExercisesSection } from './components/ExercisesSection';
import { GoalsSection } from './components/GoalsSection';
import { LoginSection } from './components/LoginSection';
import { ProgressSection } from './components/ProgressSection';
import { RegisterSection } from './components/RegisterSection';
import { WorkoutsSection } from './components/WorkoutsSection';
import { Button } from './components/ui/Button';

const NAV_TABS = ['workouts', 'exercises', 'goals', 'progress', 'admin'];
const AUTH_TABS = ['login', 'register'];

export default function App() {
  const [tab, setTab] = useState('exercises');
  const [me, setMe] = useState(null);
  const refreshMe = useCallback(async () => {
    if (!getToken()) { setMe(null); return; }
    try { setMe(await api.me()); } catch { setMe(null); }
  }, []);
  useEffect(() => { refreshMe(); }, [refreshMe]);

  useEffect(() => {
    if (me && AUTH_TABS.includes(tab)) setTab('workouts');
  }, [me, tab]);

  const handleLogout = () => {
    clearToken();
    refreshMe();
    setTab('exercises');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <span className="app-brand">Fit Ledger</span>
          <nav className="app-nav" aria-label="Main navigation">
            {NAV_TABS.map((t) => (
              <button
                key={t}
                type="button"
                className={`nav-tab${tab === t ? ' nav-tab--active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </nav>
          <div className="app-user-bar">
            {me ? (
              <>
                <span className="app-user">Logged in as {me.email}</span>
                <Button variant="outlined" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="header-auth">
                <Button
                  variant={tab === 'login' ? 'primary' : 'outlined'}
                  onClick={() => setTab('login')}
                >
                  Login
                </Button>
                <Button
                  variant={tab === 'register' ? 'primary' : 'outlined'}
                  onClick={() => setTab('register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="app-main">
        {!me && tab === 'login' && <LoginSection onAuthChange={refreshMe} />}
        {!me && tab === 'register' && <RegisterSection onAuthChange={refreshMe} />}
        {tab === 'workouts' && <WorkoutsSection />}
        {tab === 'exercises' && <ExercisesSection />}
        {tab === 'goals' && <GoalsSection />}
        {tab === 'progress' && <ProgressSection />}
        {tab === 'admin' && <AdminSection />}
      </main>
    </div>
  );
}
