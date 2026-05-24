const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:5150';

let accessToken = localStorage.getItem('accessToken') || '';

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

  listExercises: () => request('/api/Exercises', { auth: false }),
  createExercise: (body) => request('/api/Exercises', { method: 'POST', body }),
  deleteExercise: (id) => request(`/api/Exercises/${id}`, { method: 'DELETE' }),

  listGoals: () => request('/api/Goals'),
  createGoal: (body) => request('/api/Goals', { method: 'POST', body }),
  setGoalCompleted: (id, isCompleted) =>
    request(`/api/Goals/${id}/complete`, { method: 'PATCH', body: { isCompleted } }),

  listProgress: () => request('/api/Progress'),
  createProgress: (body) => request('/api/Progress', { method: 'POST', body }),

  listAdminUsers: () => request('/api/admin/users'),
  setUserRole: (id, body) => request(`/api/admin/users/${id}/role`, { method: 'PUT', body }),
};
