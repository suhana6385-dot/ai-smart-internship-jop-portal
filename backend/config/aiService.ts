import axios from "axios";

/**
 * HTTP client for the Node backend -> Python AI microservice.
 *
 * The AI service (ai-service/) is a separate FastAPI process. It is
 * NEVER called directly from the frontend — the Express backend is the
 * gateway (see routes/ai.routes.ts + controllers/ai.controller.ts).
 *
 * Base URL / timeout are read from environment variables so the AI
 * service host/port can change between local dev, Docker, and
 * production without touching code.
 */
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
const AI_SERVICE_TIMEOUT_MS = Number(process.env.AI_SERVICE_TIMEOUT_MS) || 15000;

export const aiServiceClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: AI_SERVICE_TIMEOUT_MS,
});

export default aiServiceClient;
