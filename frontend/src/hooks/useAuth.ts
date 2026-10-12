import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCredentials } from "@/redux/slices/authSlice";

/**
 * Reads session state from the Redux `auth` slice. `isAuthenticated`,
 * `user`, and `token` are consumed as-is by Navbar, Sidebar,
 * ProtectedRoute, and PublicRoute — none of those files needed to
 * change when this hook moved from local state to Redux.
 *
 * Setting credentials on login/register is done by dispatching
 * `setCredentials` directly from the mutation hooks in
 * `useAuthMutations.ts`, since TanStack Query already owns the
 * request lifecycle for those calls.
 */
export function useAuth() {
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const logout = useCallback(() => {
    dispatch(clearCredentials());
  }, [dispatch]);

  return { isAuthenticated, token, user, logout };
}
