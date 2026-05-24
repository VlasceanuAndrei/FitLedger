import { useState } from 'react';
import { api, setToken } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, Result, Section, runRequest } from './Result';

export function RegisterSection({ onAuthChange }) {
  const [registerForm, setRegisterForm] = useState({ userName: '', email: '', password: '' });
  const [validationErr, setValidationErr] = useState(null);
  const [out, setOut] = useState({ data: null, error: null });

  const setField = (key, value) => {
    setRegisterForm((f) => ({ ...f, [key]: value }));
    setValidationErr(null);
  };

  const handleRegister = async () => {
    if (!registerForm.userName.trim()) { setValidationErr('Username is required.'); return; }
    if (!registerForm.email.trim()) { setValidationErr('Email is required.'); return; }
    if (!registerForm.password) { setValidationErr('Password is required.'); return; }
    setValidationErr(null);
    const r = await runRequest(() => api.register(registerForm));
    if (!r.error && r.data?.accessToken) {
      setToken(r.data.accessToken);
      onAuthChange();
    }
    setOut(r);
  };

  return (
    <Section title="Register">
      <Field label="userName" required>
        <input
          className="field__input"
          value={registerForm.userName}
          onChange={(e) => setField('userName', e.target.value)}
        />
      </Field>
      <Field label="email" required>
        <input
          className="field__input"
          type="email"
          value={registerForm.email}
          onChange={(e) => setField('email', e.target.value)}
        />
      </Field>
      <Field label="password" required>
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

      {validationErr && <Result error={validationErr} />}
      {!validationErr && out.error && <Result error={out.error} />}
    </Section>
  );
}
