export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  headline: string;
  bio: string;
  location: string;
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: number;
  };
  skills: string[];
  interests: string[];
  careerGoal: string;
  profileCompletion: number;
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface ResumeProject {
  name: string;
  description: string;
  techStack: string[];
}

export interface ResumeExperience {
  role: string;
  organization: string;
  duration: string;
  description: string;
}

export interface ParsedResume {
  fileName: string;
  uploadedAt: string;
  skills: string[];
  projects: ResumeProject[];
  experience: ResumeExperience[];
  certifications: string[];
}

export interface ATSKeyword {
  keyword: string;
  found: boolean;
}

export interface ATSResult {
  overallScore: number;
  formattingScore: number;
  keywordScore: number;
  readabilityScore: number;
  keywords: ATSKeyword[];
  suggestions: string[];
}

export interface SkillMatchResult {
  jobTitle: string;
  company: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface SkillGapItem {
  skill: string;
  demandLevel: "High" | "Medium" | "Low";
  currentLevel: number;
  requiredLevel: number;
}

export interface LearningRecommendation {
  title: string;
  provider: string;
  duration: string;
  skill: string;
  url: string;
}

export interface CareerPath {
  title: string;
  confidence: number;
  description: string;
  averageSalary: string;
  roadmap: string[];
}

export interface CertificationRecommendationItem {
  title: string;
  provider: string;
  priority: "High" | "Medium" | "Low";
  duration: string;
  cost: string;
  skillCovered: string;
}

export interface OpportunityItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Remote" | "On-site" | "Hybrid";
  matchScore: number;
  stipendOrSalary: string;
  postedAgo: string;
  skills: string[];
  saved?: boolean;
}

export interface SalaryTrendPoint {
  month: string;
  salary: number;
}

export interface IndustryTrendData {
  trendingSkills: { skill: string; growth: number }[];
  hiringCompanies: { company: string; openings: number }[];
  salaryTrends: SalaryTrendPoint[];
  inDemandRoles: { role: string; demandScore: number }[];
}

export interface CoverLetterRequest {
  companyName: string;
  jobTitle: string;
  tone: "Formal" | "Enthusiastic" | "Concise";
  highlights: string;
}

export interface CoverLetterResult {
  content: string;
  generatedAt: string;
}

export type InterviewType = "Technical" | "HR" | "Aptitude" | "Coding";

export interface InterviewQuestion {
  id: string;
  question: string;
  type: InterviewType;
}

export interface InterviewFeedback {
  overallScore: number;
  communication: number;
  technicalAccuracy: number;
  confidence: number;
  strengths: string[];
  improvements: string[];
}

export type ApplicationStatus = "Applied" | "Interview" | "Offer" | "Rejected";

export interface ApplicationTimelineEvent {
  status: ApplicationStatus;
  date: string;
  note?: string;
}

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedOn: string;
  status: ApplicationStatus;
  timeline: ApplicationTimelineEvent[];
}

export type NotificationType =
  | "Job"
  | "Internship"
  | "Interview"
  | "Resume"
  | "Certification";

export interface StudentNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationPreferences {
  newJobs: boolean;
  internshipAlerts: boolean;
  interviewReminders: boolean;
  resumeAlerts: boolean;
  certificationReminders: boolean;
}
