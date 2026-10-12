import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface PublicRouteProps {
  children?: ReactNode;
  redirectTo?: string;
}

/**
 * Route guard for pages that should only be visible to signed-out
 * visitors (Login, Register, Forgot/Reset Password). Already
 * authenticated users are redirected straight to their dashboard.
 */
export function PublicRoute({ children, redirectTo = "/dashboard" }: PublicRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default PublicRoute;
