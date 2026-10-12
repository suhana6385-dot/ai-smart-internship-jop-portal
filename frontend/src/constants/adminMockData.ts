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
} from "@/types/admin";

export const MOCK_ADMIN_OVERVIEW: AdminOverviewStats = {
  totalStudents: 4820,
  totalCompanies: 312,
  totalJobs: 587,
  totalInternships: 264,
  placementRate: 68,
  pendingVerifications: 14,
};

export const MOCK_SIGNUP_TRENDS: SignupTrendPoint[] = [
  { month: "Feb", students: 320, companies: 18 },
  { month: "Mar", students: 410, companies: 22 },
  { month: "Apr", students: 480, companies: 26 },
  { month: "May", students: 560, companies: 31 },
  { month: "Jun", students: 640, companies: 29 },
  { month: "Jul", students: 710, companies: 35 },
];

export const MOCK_APPLICATION_BREAKDOWN: ApplicationStatusBreakdown[] = [
  { status: "Applied", count: 1840 },
  { status: "Interview", count: 620 },
  { status: "Offer", count: 340 },
  { status: "Rejected", count: 510 },
];

export const MOCK_PENDING_VERIFICATIONS: PendingVerificationItem[] = [
  { id: "pv_1", name: "Cortex AI Labs", type: "Company", submittedOn: "2026-07-08" },
  { id: "pv_2", name: "DevNext Solutions", type: "Company", submittedOn: "2026-07-07" },
  { id: "pv_3", name: "UX Research Intern", type: "Internship", submittedOn: "2026-07-09" },
  { id: "pv_4", name: "Backend Engineer II", type: "Job", submittedOn: "2026-07-06" },
];

export const MOCK_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "an_1",
    type: "Verification",
    title: "New company awaiting verification",
    message: "Cortex AI Labs submitted registration documents for review.",
    createdAt: "2026-07-09T08:15:00Z",
    read: false,
  },
  {
    id: "an_2",
    type: "ContentFlag",
    title: "Job posting flagged",
    message: "\"Backend Engineer II\" was flagged by 3 students for misleading stipend info.",
    createdAt: "2026-07-08T15:40:00Z",
    read: false,
  },
  {
    id: "an_3",
    type: "Report",
    title: "Monthly placement report ready",
    message: "The June placement report has been generated and is ready to download.",
    createdAt: "2026-07-07T09:00:00Z",
    read: true,
  },
  {
    id: "an_4",
    type: "System",
    title: "Scheduled maintenance",
    message: "Platform maintenance is scheduled for Jul 14, 1:00 AM – 2:00 AM IST.",
    createdAt: "2026-07-05T12:00:00Z",
    read: true,
  },
];

export const MOCK_PLATFORM_SETTINGS: PlatformSettings = {
  maintenanceMode: false,
  autoVerifyCompanies: false,
  contentModerationLevel: "Medium",
  allowNewRegistrations: true,
};

export const MOCK_STUDENTS: AdminStudentRecord[] = [
  { id: "s_1", name: "Ananya Sharma", email: "ananya.sharma@example.com", institution: "VIT", profileCompletion: 78, applicationsCount: 6, status: "Active", joinedOn: "2026-01-12" },
  { id: "s_2", name: "Rahul Verma", email: "rahul.verma@example.com", institution: "IIT Delhi", profileCompletion: 92, applicationsCount: 11, status: "Active", joinedOn: "2025-11-03" },
  { id: "s_3", name: "Priya Nair", email: "priya.nair@example.com", institution: "NIT Trichy", profileCompletion: 55, applicationsCount: 2, status: "Pending", joinedOn: "2026-06-28" },
  { id: "s_4", name: "Karthik Iyer", email: "karthik.iyer@example.com", institution: "BITS Pilani", profileCompletion: 88, applicationsCount: 9, status: "Active", joinedOn: "2025-09-19" },
  { id: "s_5", name: "Sneha Reddy", email: "sneha.reddy@example.com", institution: "VIT", profileCompletion: 40, applicationsCount: 0, status: "Suspended", joinedOn: "2026-03-02" },
  { id: "s_6", name: "Arjun Mehta", email: "arjun.mehta@example.com", institution: "Anna University", profileCompletion: 70, applicationsCount: 5, status: "Active", joinedOn: "2026-02-15" },
  { id: "s_7", name: "Divya Krishnan", email: "divya.krishnan@example.com", institution: "IIT Madras", profileCompletion: 95, applicationsCount: 14, status: "Active", joinedOn: "2025-08-21" },
  { id: "s_8", name: "Mohammed Faizan", email: "faizan.m@example.com", institution: "Jamia Millia", profileCompletion: 62, applicationsCount: 3, status: "Pending", joinedOn: "2026-06-10" },
];

export const MOCK_COMPANIES: AdminCompanyRecord[] = [
  { id: "c_1", name: "Nimbus Tech", industry: "Software", jobsPosted: 12, internshipsPosted: 6, verification: "Verified", joinedOn: "2025-05-14" },
  { id: "c_2", name: "Bluewave Systems", industry: "Fintech", jobsPosted: 8, internshipsPosted: 3, verification: "Verified", joinedOn: "2025-07-02" },
  { id: "c_3", name: "Cortex AI Labs", industry: "Artificial Intelligence", jobsPosted: 4, internshipsPosted: 2, verification: "Pending", joinedOn: "2026-07-08" },
  { id: "c_4", name: "DevNext Solutions", industry: "IT Services", jobsPosted: 2, internshipsPosted: 1, verification: "Pending", joinedOn: "2026-07-07" },
  { id: "c_5", name: "Zenith Softworks", industry: "Software", jobsPosted: 15, internshipsPosted: 5, verification: "Verified", joinedOn: "2025-03-11" },
  { id: "c_6", name: "GreyMatter Analytics", industry: "Data & Analytics", jobsPosted: 1, internshipsPosted: 0, verification: "Rejected", joinedOn: "2026-05-22" },
  { id: "c_7", name: "Insight Metrics", industry: "Data & Analytics", jobsPosted: 6, internshipsPosted: 2, verification: "Verified", joinedOn: "2025-10-30" },
];

export const MOCK_JOBS: AdminJobRecord[] = [
  { id: "j_1", title: "Frontend Developer", company: "Zenith Softworks", type: "Full-time", applicants: 142, status: "Active", postedOn: "2026-07-01" },
  { id: "j_2", title: "Full Stack Engineer", company: "Bluewave Systems", type: "Full-time", applicants: 98, status: "Active", postedOn: "2026-06-25" },
  { id: "j_3", title: "Backend Engineer II", company: "Cortex AI Labs", type: "Full-time", applicants: 34, status: "Flagged", postedOn: "2026-06-20" },
  { id: "j_4", title: "Associate Data Analyst", company: "Insight Metrics", type: "Full-time", applicants: 61, status: "Active", postedOn: "2026-06-18" },
  { id: "j_5", title: "QA Engineer", company: "Nimbus Tech", type: "Contract", applicants: 22, status: "Closed", postedOn: "2026-05-30" },
  { id: "j_6", title: "DevOps Engineer", company: "DevNext Solutions", type: "Full-time", applicants: 8, status: "Pending", postedOn: "2026-07-06" },
];

export const MOCK_INTERNSHIPS: AdminInternshipRecord[] = [
  { id: "i_1", title: "Frontend Developer Intern", company: "Nimbus Tech", duration: "3 months", stipend: "₹25,000/mo", applicants: 210, status: "Active", postedOn: "2026-06-28" },
  { id: "i_2", title: "Software Engineering Intern", company: "Bluewave Systems", duration: "6 months", stipend: "₹20,000/mo", applicants: 156, status: "Active", postedOn: "2026-06-22" },
  { id: "i_3", title: "UX Research Intern", company: "Zenith Softworks", duration: "2 months", stipend: "₹15,000/mo", applicants: 47, status: "Pending", postedOn: "2026-07-09" },
  { id: "i_4", title: "Machine Learning Intern", company: "Cortex AI Labs", duration: "4 months", stipend: "₹22,000/mo", applicants: 89, status: "Active", postedOn: "2026-06-15" },
  { id: "i_5", title: "Data Analyst Intern", company: "Insight Metrics", duration: "3 months", stipend: "₹18,000/mo", applicants: 63, status: "Closed", postedOn: "2026-05-20" },
];

export const MOCK_REPORT_DEFINITIONS: ReportDefinition[] = [
  { id: "rep_placement", title: "Placement Summary Report", description: "Placement rate, offers, and rejections by month.", category: "Placement" },
  { id: "rep_growth", title: "User Growth Report", description: "Student and company signup trends over time.", category: "Growth" },
  { id: "rep_engagement", title: "Engagement Report", description: "Application volume, active users, and feature usage.", category: "Engagement" },
  { id: "rep_financial", title: "Revenue & Billing Report", description: "Subscription and premium listing revenue breakdown.", category: "Financial" },
];

export const MOCK_GENERATED_REPORTS: GeneratedReport[] = [
  { id: "gr_1", title: "Placement Summary Report — June 2026", generatedOn: "2026-07-01", generatedBy: "Admin", format: "PDF" },
  { id: "gr_2", title: "User Growth Report — Q2 2026", generatedOn: "2026-06-30", generatedBy: "Admin", format: "PDF" },
  { id: "gr_3", title: "Engagement Report — May 2026", generatedOn: "2026-06-02", generatedBy: "Admin", format: "PDF" },
];

export const MOCK_ANALYTICS_SUMMARY: AnalyticsSummary = {
  totalStudents: 4820,
  totalCompanies: 312,
  placementRate: 68,
  recommendationAccuracy: 84,
  topSkills: [
    { skill: "React", demand: 92 },
    { skill: "Python", demand: 87 },
    { skill: "SQL", demand: 79 },
    { skill: "Node.js", demand: 74 },
    { skill: "AWS", demand: 68 },
  ],
  mostAppliedJobs: [
    { title: "Frontend Developer", company: "Zenith Softworks", applicants: 142 },
    { title: "Full Stack Engineer", company: "Bluewave Systems", applicants: 98 },
    { title: "Associate Data Analyst", company: "Insight Metrics", applicants: 61 },
    { title: "Backend Engineer II", company: "Cortex AI Labs", applicants: 34 },
  ],
  hiringTrends: [
    { month: "Feb", hires: 120 },
    { month: "Mar", hires: 145 },
    { month: "Apr", hires: 168 },
    { month: "May", hires: 190 },
    { month: "Jun", hires: 210 },
    { month: "Jul", hires: 224 },
  ],
  platformPerformance: {
    apiUptime: 99.94,
    avgResponseTimeMs: 182,
    errorRate: 0.32,
  },
};
