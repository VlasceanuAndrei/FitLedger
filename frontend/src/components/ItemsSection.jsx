import { useState } from 'react';
import { api } from '../api';
import { Field, Result, Section, runRequest } from './Result';

export function ItemsSection() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [out, setOut] = useState({ data: null, error: null });

  const body = () => ({
    name,
    description: description || null,
  });

  return (
    <Section title="Items (authenticated, full CRUD)">
      <button type="button" onClick={() => runRequest(() => api.listItems()).then(setOut)}>
        GET /api/Items
      </button>

      <Field label="id (guid)">
        <input value={id} onChange={(e) => setId(e.target.value)} />
      </Field>
      <button type="button" onClick={() => runRequest(() => api.getItem(id)).then(setOut)}>
        GET /api/Items/{'{id}'}
      </button>

      <Field label="name">
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="description">
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <button type="button" onClick={() => runRequest(() => api.createItem(body())).then(setOut)}>
        POST /api/Items
      </button>
      <button type="button" onClick={() => runRequest(() => api.updateItem(id, body())).then(setOut)}>
        PUT /api/Items/{'{id}'} (returns 204)
      </button>
      <button type="button" onClick={() => runRequest(() => api.deleteItem(id)).then(setOut)}>
        DELETE /api/Items/{'{id}'}
      </button>

      <Result data={out.data} error={out.error} />
    </Section>
  );
}
