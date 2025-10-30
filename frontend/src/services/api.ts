import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Automatically attach JWT token if stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // ensure headers object exists
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH ----------
export const signup = (data: { name: string; email: string; password: string }) =>
  api.post('/auth/signup', data);

export const login = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const getProfile = () => api.get('/auth/me');

// ---------- EXPERIENCES ----------
// normalize responses so frontend can rely on consistent return shapes

export const getExperiences = async () => {
  const res = await api.get('/experiences');
  // backend returns { experiences: [...] } — return the array
  if (Array.isArray(res.data)) return res.data;
  return res.data.experiences || [];
};

export const getExperienceById = async (id: string) => {
  const res = await api.get(`/experiences/${id}`);
  // backend returns { experience: {...} }
  return res.data.experience || res.data;
};

// ---------- BOOKINGS ----------
export const createBooking = async (data: {
  experienceId: string;
  slotIndex: number;
  name: string;
  email: string;
}) => {
  const res = await api.post('/bookings', data);
  return res.data;
};

export default api;
