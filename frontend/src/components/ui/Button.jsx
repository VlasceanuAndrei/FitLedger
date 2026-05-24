export function Button({ variant = 'neutral', className = '', children, ...props }) {
  const variantClass = {
    primary: 'btn-primary',
    neutral: 'btn-neutral',
    outlined: 'btn-outlined',
    danger: 'btn-danger',
  }[variant] ?? 'btn-neutral';

  return (
    <button type="button" className={`btn ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
