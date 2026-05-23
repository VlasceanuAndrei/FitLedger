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

const NAV_TABS = ['exercises', 'workouts', 'goals', 'progress', 'admin'];
const AUTH_TABS = ['login', 'register'];

const TAB_LABELS = {
  exercises: 'Exercises',
  workouts: 'Workouts',
  goals: 'Goals',
  progress: 'Progress',
  admin: 'Admin',
};

function userLabel(me) {
  const email = me.email ?? me.Email ?? '';
  const userName = me.userName ?? me.UserName ?? '';
  return { userName: userName || email, email };
}

function isAdmin(me) {
  const roles = me?.roles ?? me?.Roles ?? [];
  return Array.isArray(roles) && roles.includes('Admin');
}

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

  useEffect(() => {
    if (tab === 'admin' && !isAdmin(me)) setTab('exercises');
  }, [me, tab]);

  const handleLogout = () => {
    clearToken();
    refreshMe();
    setTab('exercises');
  };

  const loggedIn = me ? userLabel(me) : null;
  const navTabs = NAV_TABS.filter((t) => t !== 'admin' || isAdmin(me));

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <span className="app-brand">Fit Ledger</span>
          <nav className="app-nav" aria-label="Main navigation">
            {navTabs.map((t) => (
              <button
                key={t}
                type="button"
                className={`nav-tab${tab === t ? ' nav-tab--active' : ''}`}
                onClick={() => setTab(t)}
              >
                {TAB_LABELS[t] ?? t}
              </button>
            ))}
          </nav>
          <div className="app-user-bar">
            {loggedIn ? (
              <>
                <span className="app-user">
                  Logged in as {loggedIn.userName} ({loggedIn.email})
                </span>
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
        {!me && tab === 'login' && (
          <LoginSection onAuthChange={refreshMe} onGoRegister={() => setTab('register')} />
        )}
        {!me && tab === 'register' && <RegisterSection onAuthChange={refreshMe} />}
        {tab === 'workouts' && (
          <WorkoutsSection
            isLoggedIn={!!me}
            onLogin={() => setTab('login')}
            onRegister={() => setTab('register')}
          />
        )}
        {tab === 'exercises' && <ExercisesSection isLoggedIn={!!me} />}
        {tab === 'goals' && (
          <GoalsSection
            isLoggedIn={!!me}
            onLogin={() => setTab('login')}
            onRegister={() => setTab('register')}
          />
        )}
        {tab === 'progress' && (
          <ProgressSection
            isLoggedIn={!!me}
            onLogin={() => setTab('login')}
            onRegister={() => setTab('register')}
          />
        )}
        {tab === 'admin' && isAdmin(me) && <AdminSection />}
      </main>
    </div>
  );
}
