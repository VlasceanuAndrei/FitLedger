import { useState } from 'react';
import { api } from '../api';
import { Button } from './ui/Button';
import { BtnRow, Result, Section, runRequest } from './Result';

export function AdminSection() {
  const [out, setOut] = useState({ data: null, error: null });

  return (
    <Section title="Admin (Admin role required)">
      <BtnRow>
        <Button variant="secondary" onClick={() => runRequest(() => api.listAdminUsers()).then(setOut)}>
          GET /api/admin/users
        </Button>
      </BtnRow>
      <Result data={out.data} error={out.error} />
    </Section>
  );
}
