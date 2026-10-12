import axios from "axios";
import { env } from "@/config/env";

// Was reading import.meta.env.VITE_API_BASE_URL directly, which is
// undefined (and silently breaks every request) if the env var isn't
// set. `env.apiBaseUrl` provides the same value with a real fallback,
// and now correctly includes the backend's actual /api/v1 prefix
// (the real Express app mounts routes at app.use("/api/v1", ...),
// not "/api").
export const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// The backend's `protect` middleware (auth.middleware.ts) returns 401 for
// any missing/invalid/expired token. Without this, an expired token would
// leave the app stuck: Redux still thinks the user is authenticated
// (token exists in localStorage) while every real API call silently fails
// and every page falls back to mock data via withFallback(), which looks
// like a working app but isn't. This clears the stale session and sends
// the user back to login instead.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// This backend also exposes AI-flavored features under /api/v1/ai/*
// (see backend/routes/ai.routes.ts), which proxy to the Python AI
// microservice in ai-service/. The frontend never calls the AI service
// directly — it goes through this same `api` instance like every other
// request; see studentService.ts for how each AI feature is wired.

export default api;
