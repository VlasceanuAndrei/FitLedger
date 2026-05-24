import { useState } from 'react';
import { api, setToken } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, Result, Section, runRequest } from './Result';
import { LIMITS, collectErrors, serverFieldErrors, textError } from '../validation';

const LOGIN_PASSWORD = { max: LIMITS.password.max, trim: false };

export function LoginSection({ onAuthChange, onGoRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const clearField = (key) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFormError(null);
  };

  const handleLogin = async () => {
    const errors = collectErrors([
      ['email', textError('Email', email, LIMITS.email)],
      ['password', textError('Password', password, LOGIN_PASSWORD)],
    ]);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setFormError(null);
      return;
    }
    setFieldErrors({});
    const r = await runRequest(() => api.login({ email: email.trim(), password }));
    if (!r.error && r.data?.accessToken) {
      setToken(r.data.accessToken);
      onAuthChange();
      setFormError(null);
      return;
    }
    const serverErrors = serverFieldErrors(r.data, ['email', 'password']);
    if (Object.keys(serverErrors).length) {
      setFieldErrors(serverErrors);
      setFormError(null);
      return;
    }
    setFormError(r.error ?? 'Login failed.');
  };

  return (
    <Section title="Login">
      <Field label="email" required error={fieldErrors.email}>
        <input
          className="field__input"
          type="email"
          maxLength={LIMITS.email.max}
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearField('email'); }}
        />
      </Field>
      <Field label="password" required error={fieldErrors.password}>
        <input
          className="field__input"
          type="password"
          maxLength={LIMITS.password.max}
          value={password}
          onChange={(e) => { setPassword(e.target.value); clearField('password'); }}
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

      {formError && <Result error={formError} />}
    </Section>
  );
}
