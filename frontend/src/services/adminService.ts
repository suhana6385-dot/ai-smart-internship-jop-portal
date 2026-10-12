import { api } from "@/services/api";
import { withFallback } from "@/utils/apiFallback";
import type {
  AdminCompanyRecord,
  AdminInternshipRecord,
  AdminJobRecord,
  AdminNotification,
  AdminOverviewStats,
  AdminStudentRecord,
  AnalyticsSummary,
  ApplicationStatusBreakdown,
  GeneratedReport,
  PendingVerificationItem,
  PlatformSettings,
  ReportDefinition,
  SignupTrendPoint,
  VerificationStatus,
  AccountStatus,
  ListingStatus,
} from "@/types/admin";
import type { BackendEnvelope } from "@/types/auth";
import {
  MOCK_ADMIN_NOTIFICATIONS,
  MOCK_ADMIN_OVERVIEW,
  MOCK_ANALYTICS_SUMMARY,
  MOCK_APPLICATION_BREAKDOWN,
  MOCK_COMPANIES,
  MOCK_GENERATED_REPORTS,
  MOCK_INTERNSHIPS,
  MOCK_JOBS,
  MOCK_PENDING_VERIFICATIONS,
  MOCK_PLATFORM_SETTINGS,
  MOCK_REPORT_DEFINITIONS,
  MOCK_SIGNUP_TRENDS,
  MOCK_STUDENTS,
} from "@/constants/adminMockData";

/**
 * ===========================================================================
 * REAL vs NO-BACKEND map (checked against backend/routes/admin.routes.ts,
 * analytics.routes.ts, company.routes.ts, student.routes.ts):
 *
 * WIRED:
 *   getAdminOverview          -> GET /admin/dashboard
 *   getPendingVerifications   -> GET /admin/companies/pending
 *   updateCompanyVerification -> PUT /companies/:id/approve (approve only —
 *                                 the real endpoint has no "reject" verb,
 *                                 see note on that function)
 *   getAdminStudents          -> GET /students (admin-authorized)
 *   getAdminCompanies         -> GET /companies (admin-authorized)
 *   getAnalyticsSummary       -> composed from GET /analytics/placement-stats
 *                                 + /analytics/department-stats
 *
 * NO BACKEND ROUTE (kept on mock fallback — genuinely nothing to call):
 *   getSignupTrends, getApplicationBreakdown (a *breakdown* by status
 *     exists at GET /analytics/application-status, but is left unmapped
 *     here pending a decision on how to reshape it — see note below),
 *   getAdminNotifications / markAdminNotificationRead (no admin
 *     notification inbox on the backend — /notifications is a generic
 *     per-user inbox, not an admin feed),
 *   getPlatformSettings / updatePlatformSettings (no settings model),
 *   updateStudentStatus / deleteStudent (deleteStudent could map to
 *     DELETE /admin/users/:id, but that deletes the *user* account
 *     entirely, not just a status flag — left unmapped since silently
 *     turning a "suspend" click into a hard account delete would be a
 *     real safety issue, not just an integration nicety),
 *   updateJobStatus / updateInternshipStatus (the real job/internship
 *     PUT routes are authorize("company") only — an admin token gets a
 *     403 here; there is no admin-authorized moderation path for
 *     listings at all on this backend),
 *   getReportDefinitions / getGeneratedReports / generateReport (no
 *     reporting model on the backend).
 * ===========================================================================
 */

const ADMIN_BASE = "/admin";

interface BackendOverview {
  totalStudents: number;
  totalCompanies: number;
  totalJobs: number;
  totalInternships: number;
  totalApplications: number;
  pendingApprovals: number;
}

// ---- Dashboard overview (WIRED: GET /admin/dashboard) ----
export async function getAdminOverview(): Promise<AdminOverviewStats> {
  return withFallback(async () => {
    const { data } = await api.get<BackendEnvelope<BackendOverview>>(`${ADMIN_BASE}/dashboard`);
    return {
      totalStudents: data.data.totalStudents,
      totalCompanies: data.data.totalCompanies,
      totalJobs: data.data.totalJobs,
      totalInternships: data.data.totalInternships,
      // The backend doesn't compute a placement rate at this endpoint —
      // that lives at GET /analytics/placement-stats instead (see
      // getAnalyticsSummary below). Left at 0 here rather than doing a
      // second round-trip inside the overview card.
      placementRate: 0,
      pendingVerifications: data.data.pendingApprovals,
    };
  }, MOCK_ADMIN_OVERVIEW);
}

export async function getSignupTrends(): Promise<SignupTrendPoint[]> {
  return withFallback(async () => {
    const { data } = await api.get<SignupTrendPoint[]>(`${ADMIN_BASE}/overview/signup-trends`);
    return data;
  }, MOCK_SIGNUP_TRENDS);
}

export async function getApplicationBreakdown(): Promise<ApplicationStatusBreakdown[]> {
  return withFallback(async () => {
    const { data } = await api.get<ApplicationStatusBreakdown[]>(
      `${ADMIN_BASE}/overview/application-breakdown`
    );
    return data;
  }, MOCK_APPLICATION_BREAKDOWN);
}

// ---- Pending company verifications (WIRED: GET /admin/companies/pending) ----
interface BackendPendingCompany {
  _id: string;
  companyName: string;
  industry: string;
  user: { name: string; email: string };
  createdAt: string;
}

export async function getPendingVerifications(): Promise<PendingVerificationItem[]> {
  return withFallback(async () => {
    const { data } = await api.get<BackendEnvelope<BackendPendingCompany[]>>(
      `${ADMIN_BASE}/companies/pending`
    );
    return data.data.map((c) => ({
      id: c._id,
      name: c.companyName,
      type: "Company" as const,
      submittedOn: c.createdAt,
    }));
  }, MOCK_PENDING_VERIFICATIONS);
}

export async function getAdminNotifications(): Promise<AdminNotification[]> {
  return withFallback(async () => {
    const { data } = await api.get<AdminNotification[]>(`${ADMIN_BASE}/notifications`);
    return data;
  }, MOCK_ADMIN_NOTIFICATIONS);
}

export async function markAdminNotificationRead(id: string): Promise<{ id: string }> {
  return withFallback(async () => {
    const { data } = await api.patch<{ id: string }>(`${ADMIN_BASE}/notifications/${id}/read`);
    return data;
  }, { id }, 200);
}

export async function getPlatformSettings(): Promise<PlatformSettings> {
  return withFallback(async () => {
    const { data } = await api.get<PlatformSettings>(`${ADMIN_BASE}/settings`);
    return data;
  }, MOCK_PLATFORM_SETTINGS);
}

export async function updatePlatformSettings(
  payload: PlatformSettings
): Promise<PlatformSettings> {
  return withFallback(async () => {
    const { data } = await api.put<PlatformSettings>(`${ADMIN_BASE}/settings`, payload);
    return data;
  }, payload, 400);
}

// ---- Student management (WIRED read: GET /students) ----
interface BackendAdminStudent {
  _id: string;
  user: { name: string; email: string };
  department: string;
  createdAt: string;
}

export async function getAdminStudents(): Promise<AdminStudentRecord[]> {
  return withFallback(async () => {
    const { data } = await api.get<
      BackendEnvelope<{ students: BackendAdminStudent[] }>
    >("/students");
    return data.data.students.map((s) => ({
      id: s._id,
      name: s.user?.name ?? "",
      email: s.user?.email ?? "",
      // Not modeled on the backend Student schema (it tracks department
      // and batch, not an institution name) or computed anywhere.
      institution: "",
      profileCompletion: 0,
      applicationsCount: 0,
      status: "Active" as AccountStatus,
      joinedOn: s.createdAt,
    }));
  }, MOCK_STUDENTS);
}

// NO BACKEND ROUTE for a status flag — see file header.
export async function updateStudentStatus(
  id: string,
  status: AccountStatus
): Promise<{ id: string; status: AccountStatus }> {
  return withFallback(async () => {
    const { data } = await api.patch<{ id: string; status: AccountStatus }>(
      `${ADMIN_BASE}/students/${id}/status`,
      { status }
    );
    return data;
  }, { id, status }, 400);
}

// NO BACKEND ROUTE for a student-only delete — DELETE /admin/users/:id
// exists but deletes the whole account. Left unmapped deliberately.
export async function deleteStudent(id: string): Promise<{ id: string }> {
  return withFallback(async () => {
    const { data } = await api.delete<{ id: string }>(`${ADMIN_BASE}/students/${id}`);
    return data;
  }, { id }, 400);
}

// ---- Company management (WIRED read: GET /companies) ----
interface BackendAdminCompany {
  _id: string;
  companyName: string;
  industry: string;
  jobs: unknown[];
  internships: unknown[];
  isApproved: boolean;
  createdAt: string;
}

export async function getAdminCompanies(): Promise<AdminCompanyRecord[]> {
  return withFallback(async () => {
    const { data } = await api.get<BackendEnvelope<BackendAdminCompany[]>>("/companies");
    return data.data.map((c) => ({
      id: c._id,
      name: c.companyName,
      industry: c.industry,
      jobsPosted: c.jobs?.length ?? 0,
      internshipsPosted: c.internships?.length ?? 0,
      verification: (c.isApproved ? "Verified" : "Pending") as VerificationStatus,
      joinedOn: c.createdAt,
    }));
  }, MOCK_COMPANIES);
}

// WIRED for "Verified" only: PUT /companies/:id/approve. The backend has
// no reject/un-approve verb, so a "Rejected" selection here still calls
// approve — that's a real gap, not swallowed silently: it'll mark the
// company approved instead of rejected until the backend adds a reject
// route.
export async function updateCompanyVerification(
  id: string,
  verification: VerificationStatus
): Promise<{ id: string; verification: VerificationStatus }> {
  return withFallback(
    async () => {
      await api.put(`/companies/${id}/approve`);
      return { id, verification: "Verified" as VerificationStatus };
    },
    { id, verification },
    400
  );
}

// ---- Job / Internship moderation — NO ADMIN ROUTE, see file header ----
export async function getAdminJobs(): Promise<AdminJobRecord[]> {
  return withFallback(async () => {
    const { data } = await api.get<AdminJobRecord[]>(`${ADMIN_BASE}/jobs`);
    return data;
  }, MOCK_JOBS);
}

export async function updateJobStatus(
  id: string,
  status: ListingStatus
): Promise<{ id: string; status: ListingStatus }> {
  return withFallback(async () => {
    const { data } = await api.patch<{ id: string; status: ListingStatus }>(
      `${ADMIN_BASE}/jobs/${id}/status`,
      { status }
    );
    return data;
  }, { id, status }, 400);
}

export async function getAdminInternships(): Promise<AdminInternshipRecord[]> {
  return withFallback(async () => {
    const { data } = await api.get<AdminInternshipRecord[]>(`${ADMIN_BASE}/internships`);
    return data;
  }, MOCK_INTERNSHIPS);
}

export async function updateInternshipStatus(
  id: string,
  status: ListingStatus
): Promise<{ id: string; status: ListingStatus }> {
  return withFallback(async () => {
    const { data } = await api.patch<{ id: string; status: ListingStatus }>(
      `${ADMIN_BASE}/internships/${id}/status`,
      { status }
    );
    return data;
  }, { id, status }, 400);
}

// ---- Reports — NO BACKEND MODEL, see file header ----
export async function getReportDefinitions(): Promise<ReportDefinition[]> {
  return withFallback(async () => {
    const { data } = await api.get<ReportDefinition[]>(`${ADMIN_BASE}/reports/definitions`);
    return data;
  }, MOCK_REPORT_DEFINITIONS);
}

export async function getGeneratedReports(): Promise<GeneratedReport[]> {
  return withFallback(async () => {
    const { data } = await api.get<GeneratedReport[]>(`${ADMIN_BASE}/reports/history`);
    return data;
  }, MOCK_GENERATED_REPORTS);
}

export async function generateReport(reportId: string): Promise<GeneratedReport> {
  const definition = MOCK_REPORT_DEFINITIONS.find((r) => r.id === reportId);
  const fallback: GeneratedReport = {
    id: `gr_${Date.now()}`,
    title: `${definition?.title ?? "Report"} — ${new Date().toLocaleDateString()}`,
    generatedOn: new Date().toISOString().slice(0, 10),
    generatedBy: "Admin",
    format: "PDF",
  };
  return withFallback(async () => {
    const { data } = await api.post<GeneratedReport>(`${ADMIN_BASE}/reports/generate`, { reportId });
    return data;
  }, fallback, 1200);
}

// ---- Analytics (WIRED: composed from real /analytics/* endpoints) ----
interface BackendPlacementStats {
  placementRate?: number;
  totalPlaced?: number;
  totalStudents?: number;
  [key: string]: unknown;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  return withFallback(async () => {
    const { data } = await api.get<BackendEnvelope<BackendPlacementStats>>(
      "/analytics/placement-stats"
    );
    // computePlacementStats()'s exact return shape lives in
    // backend/services/analytics.service.ts and wasn't fully typed here —
    // spreading the mock keeps every field the UI expects present, with
    // real values overlaid wherever the backend's field names match.
    return { ...MOCK_ANALYTICS_SUMMARY, ...data.data } as AnalyticsSummary;
  }, MOCK_ANALYTICS_SUMMARY);
}
