import { useCallback, useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { api, clearToken, getToken } from './api';
import { AdminSection } from './components/AdminSection';
import { ExercisesSection } from './components/ExercisesSection';
import { GoalsSection } from './components/GoalsSection';
import { LoginSection } from './components/LoginSection';
import { ProgressSection } from './components/ProgressSection';
import { RegisterSection } from './components/RegisterSection';
import { WorkoutsSection } from './components/WorkoutsSection';
import { Button } from './components/ui/Button';

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
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  const refreshMe = useCallback(async () => {
    if (!getToken()) { setMe(null); return; }
    try { setMe(await api.me()); } catch { setMe(null); }
  }, []);

  useEffect(() => { refreshMe(); }, [refreshMe]);

  const handleLogout = () => {
    clearToken();
    refreshMe();
    navigate('/exercises');
  };

  const loggedIn = me ? userLabel(me) : null;

  const navLinks = [
    { to: '/exercises', label: 'Exercises' },
    { to: '/workouts', label: 'Workouts' },
    { to: '/goals', label: 'Goals' },
    { to: '/progress', label: 'Progress' },
    ...(isAdmin(me) ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <span className="app-brand">Fit Ledger</span>
          <nav className="app-nav" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-tab${isActive ? ' nav-tab--active' : ''}`}
              >
                {label}
              </NavLink>
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
                <NavLink to="/login">
                  {({ isActive }) => (
                    <Button variant={isActive ? 'primary' : 'outlined'}>Login</Button>
                  )}
                </NavLink>
                <NavLink to="/register">
                  {({ isActive }) => (
                    <Button variant={isActive ? 'primary' : 'outlined'}>Register</Button>
                  )}
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/exercises" replace />} />
          <Route path="/exercises" element={<ExercisesSection />} />
          <Route
            path="/workouts"
            element={
              <WorkoutsSection
                isLoggedIn={!!me}
                onLogin={() => navigate('/login')}
                onRegister={() => navigate('/register')}
              />
            }
          />
          <Route
            path="/goals"
            element={
              <GoalsSection
                isLoggedIn={!!me}
                onLogin={() => navigate('/login')}
                onRegister={() => navigate('/register')}
              />
            }
          />
          <Route
            path="/progress"
            element={
              <ProgressSection
                isLoggedIn={!!me}
                onLogin={() => navigate('/login')}
                onRegister={() => navigate('/register')}
              />
            }
          />
          <Route
            path="/login"
            element={
              me ? (
                <Navigate to="/exercises" replace />
              ) : (
                <LoginSection onAuthChange={refreshMe} onGoRegister={() => navigate('/register')} />
              )
            }
          />
          <Route
            path="/register"
            element={
              me ? (
                <Navigate to="/exercises" replace />
              ) : (
                <RegisterSection onAuthChange={refreshMe} />
              )
            }
          />
          <Route
            path="/admin"
            element={isAdmin(me) ? <AdminSection /> : <Navigate to="/exercises" replace />}
          />
          <Route path="*" element={<Navigate to="/exercises" replace />} />
        </Routes>
      </main>
    </div>
  );
}
