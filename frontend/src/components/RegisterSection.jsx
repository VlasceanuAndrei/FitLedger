import { useState } from 'react';
import { api, setToken } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, Result, Section, runRequest, validateFields } from './Result';

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
    const errors = validateFields([
      ['userName', 'Username is required.', registerForm.userName.trim()],
      ['email', 'Email is required.', registerForm.email.trim()],
      ['password', 'Password is required.', registerForm.password],
    ]);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setFormError(null);
      return;
    }
    setFieldErrors({});
    const r = await runRequest(() => api.register(registerForm));
    if (!r.error && r.data?.accessToken) {
      setToken(r.data.accessToken);
      onAuthChange();
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
          value={registerForm.userName}
          onChange={(e) => setField('userName', e.target.value)}
        />
      </Field>
      <Field label="email" required error={fieldErrors.email}>
        <input
          className="field__input"
          type="email"
          value={registerForm.email}
          onChange={(e) => setField('email', e.target.value)}
        />
      </Field>
      <Field label="password" required error={fieldErrors.password}>
        <input
          className="field__input"
          type="password"
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
