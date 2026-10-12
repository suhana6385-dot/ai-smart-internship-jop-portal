import { api } from "@/services/api";
import type {
  AuthResponse,
  BackendAuthPayload,
  BackendEnvelope,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/types/auth";

/**
 * Real backend routes (backend/routes/auth.routes.ts), mounted at
 * /api/v1/auth by app.ts. Every route below except forgot-password /
 * reset-password exists and is wired for real:
 *
 *   POST /auth/register        -> register
 *   POST /auth/login           -> login
 *   POST /auth/refresh-token   -> refreshAccessToken
 *   POST /auth/logout          -> logout (requires auth)
 *   GET  /auth/me              -> getMe (requires auth)
 *   PUT  /auth/change-password -> changePassword (requires auth)
 *
 * There is NO forgot-password or reset-password route on the backend
 * at all — no controller, no route, nothing. The ForgotPassword.tsx
 * and ResetPassword.tsx pages exist on the frontend with nowhere to
 * send their requests. Those two calls below will 404 until someone
 * adds the corresponding backend endpoints (would need a reset-token
 * flow + the existing email.service.ts to send it).
 */
const AUTH_BASE = "/auth";

function toAuthResponse(payload: BackendAuthPayload): AuthResponse {
  return {
    user: payload.user,
    // The backend issues both an access token and a refresh token.
    // Only the access token is persisted here (as `token`) since
    // that's all the current authSlice/interceptor use — refresh-token
    // rotation isn't wired up. Access tokens last 7 days
    // (JWT_EXPIRES_IN in backend/.env), so sessions won't silently
    // expire mid-use for typical usage, but there's no auto-refresh.
    token: payload.accessToken,
  };
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<BackendEnvelope<BackendAuthPayload>>(
    `${AUTH_BASE}/login`,
    payload
  );
  return toAuthResponse(data.data);
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<BackendEnvelope<BackendAuthPayload>>(
    `${AUTH_BASE}/register`,
    payload
  );
  return toAuthResponse(data.data);
}

/**
 * NO BACKEND ROUTE EXISTS FOR THIS. Left wired to the plausible path
 * so the request fails loudly (network/404 error -> toast) rather
 * than silently, and so it's a one-line change once the backend adds
 * the route.
 */
export async function forgotPasswordRequest(
  payload: ForgotPasswordPayload
): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>(
    `${AUTH_BASE}/forgot-password`,
    payload
  );
  return data;
}

/** NO BACKEND ROUTE EXISTS FOR THIS — see forgotPasswordRequest above. */
export async function resetPasswordRequest(
  payload: ResetPasswordPayload
): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>(
    `${AUTH_BASE}/reset-password`,
    payload
  );
  return data;
}

export async function logoutRequest(): Promise<void> {
  await api.post(`${AUTH_BASE}/logout`);
}
