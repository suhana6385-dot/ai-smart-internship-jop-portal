import { QueryClient } from "@tanstack/react-query";

/**
 * Centralized TanStack Query defaults for the whole app. Individual
 * query hooks (useStudentQueries, useAdminQueries, ...) can still
 * override `staleTime` etc. per-query; these are just sane fallbacks.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60_000,
      gcTime: 5 * 60_000,
    },
    mutations: {
      retry: 0,
    },
  },
});
