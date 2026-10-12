import { useQuery } from "@tanstack/react-query";
import {
  getAdminCompanies,
  getAdminInternships,
  getAdminJobs,
  getAdminNotifications,
  getAdminOverview,
  getAdminStudents,
  getAnalyticsSummary,
  getApplicationBreakdown,
  getGeneratedReports,
  getPendingVerifications,
  getPlatformSettings,
  getReportDefinitions,
  getSignupTrends,
} from "@/services/adminService";

const staleTime = 60_000;

export function useAdminOverviewQuery() {
  return useQuery({ queryKey: ["admin", "overview"], queryFn: getAdminOverview, staleTime });
}

export function useSignupTrendsQuery() {
  return useQuery({ queryKey: ["admin", "signup-trends"], queryFn: getSignupTrends, staleTime });
}

export function useApplicationBreakdownQuery() {
  return useQuery({
    queryKey: ["admin", "application-breakdown"],
    queryFn: getApplicationBreakdown,
    staleTime,
  });
}

export function usePendingVerificationsQuery() {
  return useQuery({
    queryKey: ["admin", "pending-verifications"],
    queryFn: getPendingVerifications,
    staleTime: 30_000,
  });
}

export function useAdminNotificationsQuery() {
  return useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: getAdminNotifications,
    staleTime: 30_000,
  });
}

export function usePlatformSettingsQuery() {
  return useQuery({ queryKey: ["admin", "settings"], queryFn: getPlatformSettings, staleTime });
}

export function useAdminStudentsQuery() {
  return useQuery({ queryKey: ["admin", "students"], queryFn: getAdminStudents, staleTime });
}

export function useAdminCompaniesQuery() {
  return useQuery({ queryKey: ["admin", "companies"], queryFn: getAdminCompanies, staleTime });
}

export function useAdminJobsQuery() {
  return useQuery({ queryKey: ["admin", "jobs"], queryFn: getAdminJobs, staleTime });
}

export function useAdminInternshipsQuery() {
  return useQuery({
    queryKey: ["admin", "internships"],
    queryFn: getAdminInternships,
    staleTime,
  });
}

export function useReportDefinitionsQuery() {
  return useQuery({
    queryKey: ["admin", "report-definitions"],
    queryFn: getReportDefinitions,
    staleTime,
  });
}

export function useGeneratedReportsQuery() {
  return useQuery({
    queryKey: ["admin", "generated-reports"],
    queryFn: getGeneratedReports,
    staleTime,
  });
}

export function useAnalyticsSummaryQuery() {
  return useQuery({
    queryKey: ["admin", "analytics-summary"],
    queryFn: getAnalyticsSummary,
    staleTime,
  });
}
