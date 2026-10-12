/**
 * Generic response envelope shapes. The current service layer
 * (authService, studentService, adminService) mostly types
 * `response.data` directly as the domain shape, since the placeholder
 * backend endpoints are assumed to return the resource directly. If
 * the real backend wraps responses (e.g. `{ data, message }` or
 * paginated lists), these are the shared shapes to type against —
 * add `ApiResponse<T>` / `PaginatedResponse<T>` to a service function's
 * generic instead of inventing a one-off type per endpoint.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
