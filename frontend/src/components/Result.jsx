export function Result({ label, data, error }) {
  if (error) {
    return (
      <pre style={{ color: 'crimson', whiteSpace: 'pre-wrap' }}>
        {label ? `${label}: ` : ''}
        {error}
      </pre>
    );
  }
  if (data === undefined || data === null) {
    return <pre>{label ? `${label}: ` : ''}(no content — e.g. 204)</pre>;
  }
  return (
    <pre style={{ whiteSpace: 'pre-wrap' }}>
      {label ? `${label}:\n` : ''}
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
      {label}: {children}
    </label>
  );
}

export async function runRequest(fn) {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (e) {
    return {
      data: e.data ?? null,
      error: e.message || String(e),
    };
  }
}
