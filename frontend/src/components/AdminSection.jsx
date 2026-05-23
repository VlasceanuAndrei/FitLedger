import { useState } from 'react';
import { api } from '../api';
import { Result, Section, runRequest } from './Result';

export function AdminSection() {
  const [out, setOut] = useState({ data: null, error: null });

  return (
    <Section title="Admin (Admin role required)">
      <button type="button" onClick={() => runRequest(() => api.listAdminUsers()).then(setOut)}>
        GET /api/admin/users
      </button>
      <Result data={out.data} error={out.error} />
    </Section>
  );
}
