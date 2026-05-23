import { useState } from 'react';
import { api, setToken } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Field, Result, Section, runRequest } from './Result';

export function LoginSection({ onAuthChange }) {
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

      <Result data={out.data} error={out.error} />
    </Section>
  );
}
