import { useState } from 'react';
import { api, setToken } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, Result, Section, runRequest } from './Result';

export function LoginSection({ onAuthChange, onGoRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [out, setOut] = useState({ data: null, error: null });

  const handleLogin = async () => {
    const r = await runRequest(() => api.login({ email, password }));
    if (!r.error && r.data?.accessToken) {
      setToken(r.data.accessToken);
      onAuthChange();
    }
    setOut(r);
  };

  return (
    <Section title="Login">
      <Field label="email">
        <input
          className="field__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="password">
        <input
          className="field__input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      <BtnRow>
        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
      </BtnRow>

      <p className="section-card__hint">
        Don&apos;t have an account?{' '}
        <button type="button" className="link-button" onClick={onGoRegister}>
          Register
        </button>
      </p>

      {out.error && <Result error={out.error} />}
    </Section>
  );
}
