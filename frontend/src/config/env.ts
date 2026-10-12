/**
 * Typed access to Vite environment variables. Import from here instead
 * of touching `import.meta.env` directly, so every consumer gets a
 * validated value and a sensible fallback for local development.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1",
  // Note: there is no separate frontend-facing AI service URL. The AI
  // microservice is only ever reached through the backend gateway at
  // `${apiBaseUrl}/ai/*` (see backend/routes/ai.routes.ts), using the
  // same `api` axios instance as every other request.
  appName: import.meta.env.VITE_APP_NAME ?? "AI Smart Internship & Job Recommendation Portal",
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

if (env.isDev && !import.meta.env.VITE_API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    "[env] VITE_API_BASE_URL is not set — falling back to http://localhost:5000/api. " +
      "Copy .env.example to .env and adjust as needed."
  );
}
