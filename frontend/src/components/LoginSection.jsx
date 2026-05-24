import { useState } from 'react';
import { api, setToken } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, Result, Section, runRequest } from './Result';

export function LoginSection({ onAuthChange, onGoRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErr, setValidationErr] = useState(null);
  const [out, setOut] = useState({ data: null, error: null });

  const handleLogin = async () => {
    if (!email.trim()) { setValidationErr('Email is required.'); return; }
    if (!password) { setValidationErr('Password is required.'); return; }
    setValidationErr(null);
    const r = await runRequest(() => api.login({ email, password }));
    if (!r.error && r.data?.accessToken) {
      setToken(r.data.accessToken);
      onAuthChange();
    }
    setOut(r);
  };

  return (
    <Section title="Login">
      <Field label="email" required>
        <input
          className="field__input"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setValidationErr(null); }}
        />
      </Field>
      <Field label="password" required>
        <input
          className="field__input"
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setValidationErr(null); }}
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

      {validationErr && <Result error={validationErr} />}
      {!validationErr && out.error && <Result error={out.error} />}
    </Section>
  );
}
