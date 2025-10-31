import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ✅ Centralized error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data || error.message);
    throw error;
  }
);

export default api;

// =========================
// AUTH REQUESTS
// =========================
export async function signup(name: string, email: string, password: string) {
  const res = await api.post("/auth/signup", { name, email, password });
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

// =========================
// EXPERIENCES REQUESTS
// =========================
export async function getAllExperiences() {
  const res = await api.get("/experiences");
  return res.data.experiences; // ✅ consistent with backend structure
}

export async function getExperienceById(id: string) {
  const res = await api.get(`/experiences/${id}`);
  return res.data.experience; // ✅ fixed to return the actual object
}

// =========================
// BOOKINGS REQUESTS
// =========================
export async function createBooking(data: {
  name: string;
  email: string;
  refId: string;
  experienceId: string;
  date: string;
  time: string;
  qty: number;
}) {
  const res = await api.post("/bookings", data);
  return res.data;
}

export async function getUserBookings() {
  const res = await api.get("/bookings");
  return res.data.bookings;
}

// =========================
// PROMO REQUESTS
// =========================
export async function applyPromo(code: string) {
  const res = await api.post("/promo/apply", { code });
  return res.data;
}
