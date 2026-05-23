import { useState } from 'react';
import { api, setToken } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, Result, Section, runRequest } from './Result';

export function RegisterSection({ onAuthChange }) {
  const [registerForm, setRegisterForm] = useState({ userName: '', email: '', password: '' });
  const [out, setOut] = useState({ data: null, error: null });

  const handleRegister = async () => {
    const r = await runRequest(() => api.register(registerForm));
    if (!r.error && r.data?.accessToken) {
      setToken(r.data.accessToken);
      onAuthChange();
    }
    setOut(r);
  };

  return (
    <Section title="Register">
      <Field label="userName">
        <input
          className="field__input"
          value={registerForm.userName}
          onChange={(e) => setRegisterForm({ ...registerForm, userName: e.target.value })}
        />
      </Field>
      <Field label="email">
        <input
          className="field__input"
          type="email"
          value={registerForm.email}
          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
        />
      </Field>
      <Field label="password">
        <input
          className="field__input"
          type="password"
          value={registerForm.password}
          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
        />
      </Field>
      <BtnRow>
        <Button variant="primary" onClick={handleRegister}>
          Register
        </Button>
      </BtnRow>

      {out.error && <Result error={out.error} />}
    </Section>
  );
}
