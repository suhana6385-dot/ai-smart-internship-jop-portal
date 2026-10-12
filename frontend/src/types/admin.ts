export type AccountStatus = "Active" | "Suspended" | "Pending";
export type VerificationStatus = "Verified" | "Pending" | "Rejected";
export type ListingStatus = "Active" | "Closed" | "Flagged" | "Pending";

export interface AdminStudentRecord {
  id: string;
  name: string;
  email: string;
  institution: string;
  profileCompletion: number;
  applicationsCount: number;
  status: AccountStatus;
  joinedOn: string;
}

export interface AdminCompanyRecord {
  id: string;
  name: string;
  industry: string;
  jobsPosted: number;
  internshipsPosted: number;
  verification: VerificationStatus;
  joinedOn: string;
}

export interface AdminJobRecord {
  id: string;
  title: string;
  company: string;
  type: "Full-time" | "Part-time" | "Contract";
  applicants: number;
  status: ListingStatus;
  postedOn: string;
}

export interface AdminInternshipRecord {
  id: string;
  title: string;
  company: string;
  duration: string;
  stipend: string;
  applicants: number;
  status: ListingStatus;
  postedOn: string;
}

export interface AdminOverviewStats {
  totalStudents: number;
  totalCompanies: number;
  totalJobs: number;
  totalInternships: number;
  placementRate: number;
  pendingVerifications: number;
}

export interface SignupTrendPoint {
  month: string;
  students: number;
  companies: number;
}

export interface ApplicationStatusBreakdown {
  status: string;
  count: number;
}

export interface PendingVerificationItem {
  id: string;
  name: string;
  type: "Company" | "Job" | "Internship";
  submittedOn: string;
}

export type AdminNotificationType =
  | "Verification"
  | "Report"
  | "System"
  | "ContentFlag";

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface PlatformSettings {
  maintenanceMode: boolean;
  autoVerifyCompanies: boolean;
  contentModerationLevel: "Low" | "Medium" | "High";
  allowNewRegistrations: boolean;
}

export interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  category: "Placement" | "Growth" | "Engagement" | "Financial";
}

export interface GeneratedReport {
  id: string;
  title: string;
  generatedOn: string;
  generatedBy: string;
  format: "PDF";
}

export interface AnalyticsSummary {
  totalStudents: number;
  totalCompanies: number;
  placementRate: number;
  recommendationAccuracy: number;
  topSkills: { skill: string; demand: number }[];
  mostAppliedJobs: { title: string; company: string; applicants: number }[];
  hiringTrends: { month: string; hires: number }[];
  platformPerformance: {
    apiUptime: number;
    avgResponseTimeMs: number;
    errorRate: number;
  };
}
