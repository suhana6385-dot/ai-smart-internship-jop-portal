import type { AuthUser, UserRole } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

/**
 * Shape the real backend actually returns from /auth/login, /auth/register,
 * and /auth/refresh-token: an { success, message, data } envelope, with
 * both an accessToken and a refreshToken inside `data` (see
 * backend/controllers/auth.controller.ts). authService unwraps this into
 * the flat AuthResponse above so the rest of the app (authSlice, hooks,
 * pages) doesn't need to know about the envelope.
 */
export interface BackendEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface BackendAuthPayload {
  user: { id: string; name: string; email: string; role: AuthUser["role"] };
  accessToken: string;
  refreshToken: string;
}

export interface MessageResponse {
  message: string;
}
