/**
 * Central path constants. Existing pages currently reference routes
 * as literal strings (e.g. `to="/dashboard"`), which stays that way
 * per the no-touching-completed-modules rule — but any *new* code
 * should prefer this map over hardcoded strings to avoid typos and
 * make future renames a one-line change.
 */
export const ROUTES = {
  home: "/",
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  student: {
    dashboard: "/dashboard",
    profile: "/profile",
    resumeAnalyzer: "/resume-analyzer",
    resumeBuilder: "/resume-builder",
    atsScore: "/ats-score",
    skillMatching: "/skill-matching",
    skillGap: "/skill-gap",
    careerRecommendation: "/career-recommendation",
    certificationRecommendation: "/certification-recommendation",
    internshipRecommendation: "/internship-recommendation",
    jobRecommendation: "/job-recommendation",
    industryTrend: "/industry-trend",
    coverLetter: "/cover-letter",
    mockInterview: "/mock-interview",
    applicationTracking: "/application-tracking",
    notifications: "/notifications",
    settings: "/settings",
  },
  company: {
    dashboard: "/company/dashboard",
    profile: "/company/profile",
    postJob: "/company/post-job",
    postInternship: "/company/post-internship",
    candidateRanking: "/company/candidate-ranking",
    applicants: "/company/applicants",
    interviews: "/company/interviews",
    reports: "/company/reports",
  },
  admin: {
    dashboard: "/admin/dashboard",
    students: "/admin/students",
    companies: "/admin/companies",
    jobs: "/admin/jobs",
    internships: "/admin/internships",
    certifications: "/admin/certifications",
    analytics: "/admin/analytics",
    reports: "/admin/reports",
  },
} as const;

export const PAGINATION = {
  defaultPageSize: 8,
  pageSizeOptions: [8, 16, 24, 50],
} as const;

export const FILE_UPLOAD = {
  maxResumeSizeMb: 5,
  acceptedResumeTypes: [".pdf", ".doc", ".docx"],
  acceptedResumeMimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

export const DATE_FORMAT = {
  short: "MMM d, yyyy",
  long: "MMMM d, yyyy 'at' h:mm a",
  iso: "yyyy-MM-dd",
} as const;

export const TOAST_DURATION_MS = 4000;
