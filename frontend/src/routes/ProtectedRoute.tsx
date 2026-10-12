import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * Route guard for authenticated areas (Student / Company / Admin
 * dashboards). Redirects unauthenticated users to the login page,
 * preserving the attempted location so they can be sent back after
 * signing in. Can be used either as a layout route element
 * (`<ProtectedRoute />` with nested children rendered via <Outlet />)
 * or wrapping a single element (`<ProtectedRoute>...</ProtectedRoute>`).
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;
