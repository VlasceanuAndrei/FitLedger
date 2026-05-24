export function Result({ label, data, error }) {
  if (error) {
    return (
      <pre className="result-panel result-panel--error">
        {label ? `${label}: ` : ''}
        {error}
      </pre>
    );
  }
  if (data === undefined || data === null) {
    return (
      <pre className="result-panel result-panel--empty">
        {label ? `${label}: ` : ''}
        (no content — e.g. 204)
      </pre>
    );
  }
  return (
    <pre className="result-panel">
      {label ? `${label}:\n` : ''}
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export function Section({ title, children }) {
  return (
    <section className="section-card">
      <h2 className="section-card__title">{title}</h2>
      {children}
    </section>
  );
}

export function Field({ label, required, error, children }) {
  return (
    <label className={`field${error ? ' field--invalid' : ''}`}>
      <span className="field__label">
        {label}
        {required && <span className="field__required"> *</span>}
      </span>
      {children}
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}

export function validateFields(checks) {
  const errors = {};
  for (const [key, message, valid] of checks) {
    if (!valid) errors[key] = message;
  }
  return errors;
}

export function BtnRow({ children }) {
  return <div className="btn-row">{children}</div>;
}

export function Divider() {
  return <hr className="section-card__divider" />;
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
