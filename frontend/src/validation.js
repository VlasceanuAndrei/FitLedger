export const LIMITS = {
  userName: {
    min: 3,
    max: 30,
    pattern: /^[A-Za-z0-9._-]+$/,
    patternMessage: 'Username may contain only letters, digits, dots, underscores and hyphens.',
  },
  email: {
    min: 5,
    max: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: 'Enter a valid email address.',
  },
  password: { min: 8, max: 128, trim: false },
  workoutName: { min: 2, max: 100 },
  workoutExercises: { max: 50 },
  goalTitle: { min: 2, max: 100 },
  goalDescription: { max: 500, optional: true },
  metric: { min: 2, max: 50 },
  progressValue: { min: 0, max: 10000, decimals: 2 },
  exerciseName: { min: 2, max: 60 },
  dateYears: 5,
};

export function textError(label, value, rule) {
  const text = rule.trim === false ? value ?? '' : (value ?? '').trim();
  if (!text) return rule.optional ? null : `${label} is required.`;
  if (rule.min && text.length < rule.min) {
    return `${label} must be at least ${rule.min} characters.`;
  }
  if (rule.max && text.length > rule.max) {
    return `${label} must be at most ${rule.max} characters.`;
  }
  if (rule.pattern && !rule.pattern.test(text)) return rule.patternMessage;
  return null;
}

export function numberError(label, value, rule) {
  if (value === '' || value === null || value === undefined) return `${label} is required.`;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return `${label} must be a number.`;
  if (parsed < rule.min || parsed > rule.max) {
    return `${label} must be between ${rule.min} and ${rule.max}.`;
  }
  const decimals = (String(value).split('.')[1] ?? '').length;
  if (rule.decimals !== undefined && decimals > rule.decimals) {
    return `${label} must have at most ${rule.decimals} decimal places.`;
  }
  return null;
}

export function dateError(label, value, years = LIMITS.dateYears) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return `${label} must be a valid date.`;
  const min = new Date();
  min.setFullYear(min.getFullYear() - years);
  const max = new Date();
  max.setFullYear(max.getFullYear() + years);
  if (date < min || date > max) return `${label} must be within ${years} years of today.`;
  return null;
}

export function countError(label, items, rule) {
  if (items.length > rule.max) return `${label} must contain at most ${rule.max} entries.`;
  return null;
}

export function collectErrors(entries) {
  const errors = {};
  for (const [key, message] of entries) {
    if (message) errors[key] = message;
  }
  return errors;
}

export function serverFieldErrors(data, keys) {
  const errors = {};
  const raw = data?.errors;
  if (!raw || typeof raw !== 'object') return errors;
  for (const [name, messages] of Object.entries(raw)) {
    const leaf = name.split('.').pop();
    const match = keys.find((key) => key.toLowerCase() === leaf.toLowerCase());
    if (match && !errors[match]) {
      errors[match] = Array.isArray(messages) ? messages[0] : String(messages);
    }
  }
  return errors;
}
