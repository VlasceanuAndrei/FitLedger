import { useState } from 'react';
import { api, setToken } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, Result, Section, runRequest } from './Result';
import { LIMITS, collectErrors, serverFieldErrors, textError } from '../validation';

export function RegisterSection({ onAuthChange, onGoLogin }) {
  const [registerForm, setRegisterForm] = useState({ userName: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const setField = (key, value) => {
    setRegisterForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFormError(null);
  };

  const handleRegister = async () => {
    const errors = collectErrors([
      ['userName', textError('Username', registerForm.userName, LIMITS.userName)],
      ['email', textError('Email', registerForm.email, LIMITS.email)],
      ['password', textError('Password', registerForm.password, LIMITS.password)],
    ]);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setFormError(null);
      return;
    }
    setFieldErrors({});
    const r = await runRequest(() =>
      api.register({
        userName: registerForm.userName.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
      })
    );
    if (!r.error && r.data?.accessToken) {
      setToken(r.data.accessToken);
      onAuthChange();
      setFormError(null);
      return;
    }
    const serverErrors = serverFieldErrors(r.data, ['userName', 'email', 'password']);
    if (Object.keys(serverErrors).length) {
      setFieldErrors(serverErrors);
      setFormError(null);
      return;
    }
    setFormError(r.error ?? 'Registration failed.');
  };

  return (
    <Section title="Register">
      <Field label="userName" required error={fieldErrors.userName}>
        <input
          className="field__input"
          maxLength={LIMITS.userName.max}
          value={registerForm.userName}
          onChange={(e) => setField('userName', e.target.value)}
        />
      </Field>
      <Field label="email" required error={fieldErrors.email}>
        <input
          className="field__input"
          type="email"
          maxLength={LIMITS.email.max}
          value={registerForm.email}
          onChange={(e) => setField('email', e.target.value)}
        />
      </Field>
      <Field label="password" required error={fieldErrors.password}>
        <input
          className="field__input"
          type="password"
          maxLength={LIMITS.password.max}
          value={registerForm.password}
          onChange={(e) => setField('password', e.target.value)}
        />
      </Field>
      <BtnRow>
        <Button variant="primary" onClick={handleRegister}>
          Register
        </Button>
      </BtnRow>

      <p className="section-card__hint">
        Already have an account?{' '}
        <button type="button" className="link-button" onClick={onGoLogin}>
          Login
        </button>
      </p>

      {formError && <Result error={formError} />}
    </Section>
  );
}
