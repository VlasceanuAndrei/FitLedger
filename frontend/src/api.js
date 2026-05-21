const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5150';

let accessToken = localStorage.getItem('accessToken') || '';

export function getApiBase() {
  return API_BASE;
}

export function getToken() {
  return accessToken;
}

export function setToken(token) {
  accessToken = token || '';
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
}

export function clearToken() {
  setToken('');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const err = new Error(
      typeof data === 'object' && data?.error ? data.error : `HTTP ${res.status}`
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  register: (body) => request('/api/Auth/register', { method: 'POST', body, auth: false }),
  login: (body) => request('/api/Auth/login', { method: 'POST', body, auth: false }),
  me: () => request('/api/Auth/me'),

  listWorkouts: () => request('/api/Workouts'),
  getWorkout: (id) => request(`/api/Workouts/${id}`),
  createWorkout: (body) => request('/api/Workouts', { method: 'POST', body }),
  updateWorkout: (id, body) => request(`/api/Workouts/${id}`, { method: 'PUT', body }),
  deleteWorkout: (id) => request(`/api/Workouts/${id}`, { method: 'DELETE' }),

  listExercisesPublic: () => request('/api/Exercises/public', { auth: false }),
  listExercises: () => request('/api/Exercises'),
  getExercise: (id) => request(`/api/Exercises/${id}`),
  createExercise: (body) => request('/api/Exercises', { method: 'POST', body }),
  deleteExercise: (id) => request(`/api/Exercises/${id}`, { method: 'DELETE' }),

  listGoals: () => request('/api/Goals'),
  getGoal: (id) => request(`/api/Goals/${id}`),
  createGoal: (body) => request('/api/Goals', { method: 'POST', body }),

  listProgress: () => request('/api/Progress'),
  getProgress: (id) => request(`/api/Progress/${id}`),
  createProgress: (body) => request('/api/Progress', { method: 'POST', body }),

  listItems: () => request('/api/Items'),
  getItem: (id) => request(`/api/Items/${id}`),
  createItem: (body) => request('/api/Items', { method: 'POST', body }),
  updateItem: (id, body) => request(`/api/Items/${id}`, { method: 'PUT', body }),
  deleteItem: (id) => request(`/api/Items/${id}`, { method: 'DELETE' }),

  listAdminUsers: () => request('/api/admin/users'),
};

export function parseGuidList(value) {
  if (!value?.trim()) return [];
  return value
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
