import { useState } from 'react';
import { api, setToken, clearToken } from '../api';
import { Field, Result, Section, runRequest } from './Result';

export function AuthSection({ onAuthChange }) {
  const [registerForm, setRegisterForm] = useState({ userName: '', email: '', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [out, setOut] = useState({ data: null, error: null });

  const handleRegister = async () => {
    const r = await runRequest(() => api.register(registerForm));
    if (!r.error && r.data?.accessToken) {
      setToken(r.data.accessToken);
      onAuthChange();
    }
    setOut(r);
  };

  const handleLogin = async () => {
    const r = await runRequest(() => api.login(loginForm));
    if (!r.error && r.data?.accessToken) {
      setToken(r.data.accessToken);
      onAuthChange();
    }
    setOut(r);
  };

  const handleMe = async () => {
    setOut(await runRequest(() => api.me()));
  };

  const handleLogout = () => {
    clearToken();
    onAuthChange();
    setOut({ data: null, error: null });
  };

  return (
    <Section title="Auth">
      <Field label="Register — userName">
        <input
          value={registerForm.userName}
          onChange={(e) => setRegisterForm({ ...registerForm, userName: e.target.value })}
        />
      </Field>
      <Field label="email">
        <input
          value={registerForm.email}
          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
        />
      </Field>
      <Field label="password">
        <input
          type="password"
          value={registerForm.password}
          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
        />
      </Field>
      <button type="button" onClick={handleRegister}>
        POST /api/Auth/register
      </button>

      <hr />

      <Field label="Login — email">
        <input
          value={loginForm.email}
          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
        />
      </Field>
      <Field label="password">
        <input
          type="password"
          value={loginForm.password}
          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
        />
      </Field>
      <button type="button" onClick={handleLogin}>
        POST /api/Auth/login
      </button>
      <button type="button" onClick={handleMe}>
        GET /api/Auth/me
      </button>
      <button type="button" onClick={handleLogout}>
        Logout (clear token)
      </button>

      <Result data={out.data} error={out.error} />
    </Section>
  );
}
