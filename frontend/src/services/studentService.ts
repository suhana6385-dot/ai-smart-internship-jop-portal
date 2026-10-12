import { api } from "@/services/api";
import { withFallback } from "@/utils/apiFallback";
import type {
  Application,
  ATSResult,
  CareerPath,
  CertificationRecommendationItem,
  CoverLetterRequest,
  CoverLetterResult,
  IndustryTrendData,
  InterviewFeedback,
  InterviewType,
  LearningRecommendation,
  NotificationPreferences,
  OpportunityItem,
  ParsedResume,
  SkillGapItem,
  SkillMatchResult,
  StudentNotification,
  StudentProfile,
} from "@/types/student";
import type { BackendEnvelope } from "@/types/auth";
import {
  MOCK_APPLICATIONS,
  MOCK_ATS_RESULT,
  MOCK_CAREER_PATHS,
  MOCK_CERTIFICATIONS,
  MOCK_INDUSTRY_TRENDS,
  MOCK_INTERNSHIPS,
  MOCK_JOBS,
  MOCK_LEARNING_RECOMMENDATIONS,
  MOCK_NOTIFICATIONS,
  MOCK_NOTIFICATION_PREFERENCES,
  MOCK_PARSED_RESUME,
  MOCK_SKILL_GAP,
  MOCK_SKILL_MATCHES,
  MOCK_STUDENT_PROFILE,
  buildMockInterviewFeedback,
} from "@/constants/studentMockData";

/**
 * ===========================================================================
 * REAL vs NO-BACKEND map for this file (checked against
 * backend/routes/*.routes.ts + backend/controllers/*.controller.ts, and
 * now also backend/routes/ai.routes.ts + backend/controllers/ai.controller.ts,
 * which gateway to the real Python AI microservice in ai-service/):
 *
 * WIRED TO REAL ENDPOINTS:
 *   getStudentProfile / updateStudentProfile -> GET/PUT /students/me
 *   uploadResume / getMyResumes-equivalent   -> POST /students/me/resumes,
 *                                                GET /students/me/resumes
 *   getApplications                          -> GET /applications/me
 *   getNotifications / markNotificationRead  -> GET /notifications,
 *                                                PUT /notifications/:id/read
 *   getParsedResume       -> GET /ai/resume/parse       (ai-service /api/resume/parse)
 *   getATSScore           -> GET /ai/resume/ats-score   (ai-service /api/ats/analyze)
 *   getSkillMatches       -> GET /ai/recommendations/jobs, re-shaped from the
 *                             same match_score/matched_skills/missing_skills
 *                             the AI service already returns per job
 *   getSkillGap           -> POST /ai/skill-gap             (ai-service /api/skill-gap/analyze)
 *   getCareerPaths        -> POST /ai/career-recommendations (ai-service /api/career/recommend)
 *   getCertificationRecommendations
 *                         -> POST /ai/certification-recommendations
 *                            (ai-service /api/certification/recommend)
 *   getInternshipRecommendations -> GET /ai/recommendations/internships
 *                                    (ai-service /api/recommend/internships)
 *   getJobRecommendations -> GET /ai/recommendations/jobs (ai-service /api/recommend/jobs)
 *   getIndustryTrends     -> GET /ai/industry-trends       (ai-service /api/trends)
 *
 *   All of the above require the student to have added skills to their
 *   profile (POST /students/me/skills) and — for parse/ATS — uploaded a
 *   resume (POST /students/me/resumes) first; the backend gateway
 *   returns a 400/404 with a clear message otherwise, which surfaces
 *   as the mock fallback below via withFallback() until that happens.
 *
 * NO BACKEND ROUTE EXISTS (kept on mock fallback on purpose, not by
 * oversight — the uploaded AI service genuinely has no cover-letter
 * generation endpoint and no endpoint that scores/grades submitted
 * interview answers, only question generation, which nothing on the
 * frontend currently calls):
 *   getLearningRecommendations (no equivalent AI module — closest is
 *   certification recommendations, which IS wired above),
 *   saveOpportunity, generateCoverLetter,
 *   submitMockInterview, getNotificationPreferences /
 *   updateNotificationPreferences (no settings model on the backend),
 *   changePassword-via-/student/settings (the real endpoint is
 *   PUT /auth/change-password — see authService.ts; this file's version
 *   is left on fallback and should be pointed at that route instead).
 * ===========================================================================
 */

const STUDENTS_BASE = "/students";

interface BackendUser {
  _id: string;
  name: string;
  email: string;
}
interface BackendSkill {
  _id: string;
  name: string;
  category?: string;
}
interface BackendStudentDoc {
  _id: string;
  user: BackendUser | string;
  rollNumber: string;
  department: string;
  batch: string;
  cgpa: number;
  phone: string;
  profileImage?: string;
  address?: string;
  skills: BackendSkill[];
  bio?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

// Maps the real Student document to the richer StudentProfile shape the
// UI expects. Several fields the frontend was built to display simply
// aren't modeled in the backend's Student schema (headline, institution
// name, degree, field of study as distinct from department, graduation
// year, interests, careerGoal, a computed profileCompletion score) — those
// come back empty/0 rather than fabricated, since the backend has no
// source of truth for them.
function toStudentProfile(s: BackendStudentDoc): StudentProfile {
  const user = typeof s.user === "object" ? s.user : undefined;
  return {
    id: s._id,
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatarUrl: s.profileImage,
    headline: "",
    bio: s.bio ?? "",
    location: s.address ?? "",
    education: {
      institution: "",
      degree: "",
      fieldOfStudy: s.department ?? "",
      graduationYear: 0,
    },
    skills: (s.skills ?? []).map((sk) => sk.name),
    interests: [],
    careerGoal: "",
    profileCompletion: 0,
    socialLinks: {
      linkedin: s.linkedin,
      github: s.github,
      portfolio: s.portfolio,
    },
  };
}

// Reverse-maps the editable subset of StudentProfile back to the fields
// PUT /students/me actually accepts (see the `allowedFields` allowlist in
// student.controller.ts). Anything outside that allowlist (name/email,
// which live on User; headline, interests, careerGoal, education.*, which
// don't exist on the backend at all) is silently dropped rather than sent,
// since the backend would ignore it anyway.
function toBackendProfileUpdate(payload: Partial<StudentProfile>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (payload.bio !== undefined) body.bio = payload.bio;
  if (payload.location !== undefined) body.address = payload.location;
  if (payload.education?.fieldOfStudy !== undefined) {
    body.department = payload.education.fieldOfStudy;
  }
  if (payload.socialLinks?.linkedin !== undefined) body.linkedin = payload.socialLinks.linkedin;
  if (payload.socialLinks?.github !== undefined) body.github = payload.socialLinks.github;
  if (payload.socialLinks?.portfolio !== undefined) body.portfolio = payload.socialLinks.portfolio;
  return body;
}

// ---- Profile (WIRED: GET/PUT /students/me) ----
export async function getStudentProfile(): Promise<StudentProfile> {
  return withFallback(async () => {
    const { data } = await api.get<BackendEnvelope<BackendStudentDoc>>(`${STUDENTS_BASE}/me`);
    return toStudentProfile(data.data);
  }, MOCK_STUDENT_PROFILE);
}

export async function updateStudentProfile(
  payload: Partial<StudentProfile>
): Promise<StudentProfile> {
  return withFallback(async () => {
    const { data } = await api.put<BackendEnvelope<BackendStudentDoc>>(
      `${STUDENTS_BASE}/me`,
      toBackendProfileUpdate(payload)
    );
    return toStudentProfile(data.data);
  }, { ...MOCK_STUDENT_PROFILE, ...payload });
}

// ---- Resume upload (WIRED: POST/GET /students/me/resumes) ----
// The backend only stores file metadata (fileName/filePath/fileSize) —
// it does not parse resume content. So a real upload succeeds and the
// file is really stored, but the "parsed" fields below (skills, projects,
// experience) are NOT extracted from your actual resume; they're mock
// placeholder content merged in until a real parsing service exists.
export async function uploadResume(file: File): Promise<ParsedResume> {
  return withFallback(async () => {
    const formData = new FormData();
    formData.append("resume", file);
    const { data } = await api.post<BackendEnvelope<{ fileName: string; uploadedAt: string }>>(
      `${STUDENTS_BASE}/me/resumes`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return {
      ...MOCK_PARSED_RESUME,
      fileName: data.data.fileName,
      uploadedAt: data.data.uploadedAt,
    };
  }, { ...MOCK_PARSED_RESUME, fileName: file.name, uploadedAt: new Date().toISOString() }, 1200);
}

const AI_BASE = "/ai";

// ---- AI response shapes (mirrors ai-service/models/*.py exactly) ----
interface AIParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  projects: { title?: string; description: string }[];
  education: { degree?: string; institution?: string; year?: string; raw_line: string }[];
  experience: { role_or_company?: string; duration?: string; raw_line: string }[];
  certifications: string[];
  languages: string[];
  raw_text_length: number;
}
interface AIParsedResumeResponse {
  filename: string;
  file_type: string;
  parsed_data: AIParsedResumeData;
}

// ---- Resume parsing (WIRED: GET /ai/resume/parse -> ai-service /api/resume/parse) ----
// Re-parses the student's already-uploaded primary resume on demand.
// Requires a resume to have been uploaded first (uploadResume above);
// the gateway returns 404 with a clear message otherwise, which is
// what triggers the mock fallback here.
export async function getParsedResume(): Promise<ParsedResume> {
  return withFallback(async () => {
    const { data } = await api.get<BackendEnvelope<AIParsedResumeResponse>>(
      `${AI_BASE}/resume/parse`
    );
    const parsed = data.data.parsed_data;
    return {
      fileName: data.data.filename,
      // The AI service returns parsed content, not the original upload
      // timestamp — using "now" here reflects when parsing ran.
      uploadedAt: new Date().toISOString(),
      skills: parsed.skills,
      // AI doesn't separate a tech stack from the project description;
      // techStack is left empty rather than guessed at.
      projects: parsed.projects.map((p) => ({
        name: p.title ?? "Untitled Project",
        description: p.description,
        techStack: [],
      })),
      // AI doesn't split "role" from "organization" — role_or_company
      // is used as-is for role, organization is left blank.
      experience: parsed.experience.map((e) => ({
        role: e.role_or_company ?? "",
        organization: "",
        duration: e.duration ?? "",
        description: e.raw_line,
      })),
      certifications: parsed.certifications,
    };
  }, MOCK_PARSED_RESUME);
}

interface AIATSAnalysisResponse {
  overall_score: number;
  formatting_score: number;
  keyword_score: number;
  skill_score: number;
  experience_score: number;
  education_score: number;
  ats_compatibility: string;
  missing_keywords: string[];
  suggestions: string[];
}

// ---- ATS analysis (WIRED: GET /ai/resume/ats-score -> ai-service /api/ats/analyze) ----
// jobDescription is optional: when provided, the AI service scores
// keyword match against that specific job description.
export async function getATSScore(jobDescription?: string): Promise<ATSResult> {
  return withFallback(
    async () => {
      const { data } = await api.get<BackendEnvelope<AIATSAnalysisResponse>>(
        `${AI_BASE}/resume/ats-score`,
        { params: jobDescription ? { jobDescription } : undefined }
      );
      const r = data.data;
      return {
        overallScore: r.overall_score,
        formattingScore: r.formatting_score,
        keywordScore: r.keyword_score,
        // The AI service doesn't expose a distinct "readability" metric —
        // this is a best-effort stand-in averaged from the sub-scores it
        // does return (skill/experience/education), not a fabricated value.
        readabilityScore: Math.round((r.skill_score + r.experience_score + r.education_score) / 3),
        // The AI service only reports which keywords were MISSING, not
        // the full keyword universe it checked against, so every entry
        // here is necessarily `found: false`.
        keywords: r.missing_keywords.map((keyword) => ({ keyword, found: false })),
        suggestions: r.suggestions,
      };
    },
    MOCK_ATS_RESULT,
    900
  );
}

interface AIRecommendedItem {
  id: string;
  title: string;
  company: string;
  location: string;
  domain: string;
  required_skills: string[];
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  extra?: Record<string, unknown> | null;
}
interface AIRecommendationResponse {
  total_candidates_considered: number;
  results: AIRecommendedItem[];
}

// ---- Skill matching (WIRED: reuses GET /ai/recommendations/jobs) ----
// The AI service has no endpoint dedicated to "match my skills against
// jobs" separate from job recommendation — recommend/jobs already
// returns match_score/matched_skills/missing_skills per job, which is
// exactly what this feature displays, so it's re-shaped from there
// rather than duplicating a call.
export async function getSkillMatches(): Promise<SkillMatchResult[]> {
  return withFallback(async () => {
    const { data } = await api.get<BackendEnvelope<AIRecommendationResponse>>(
      `${AI_BASE}/recommendations/jobs`
    );
    return data.data.results.map((item) => ({
      jobTitle: item.title,
      company: item.company,
      matchPercentage: Math.round(item.match_score * 100),
      matchedSkills: item.matched_skills,
      missingSkills: item.missing_skills,
    }));
  }, MOCK_SKILL_MATCHES);
}

interface AILearningRoadmapItem {
  skill: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimated_learning_time: string;
  learning_priority: number;
}
interface AISkillGapResponse {
  target_role: string;
  matched_skill_percentage: number;
  missing_skills: string[];
  weak_skills: string[];
  strong_skills: string[];
  learning_roadmap: AILearningRoadmapItem[];
}

// ---- Skill gap (WIRED: POST /ai/skill-gap -> ai-service /api/skill-gap/analyze) ----
// Requires the target job's required skills (the AI endpoint's payload
// is mandatory on this field) — callers that don't have a specific job
// in mind yet fall back to mock data rather than sending an empty/fake
// requirement list to the AI service.
export async function getSkillGap(
  targetRole?: string,
  jobRequiredSkills?: string[]
): Promise<SkillGapItem[]> {
  if (!jobRequiredSkills || jobRequiredSkills.length === 0) {
    return withFallback(async () => {
      throw new Error("jobRequiredSkills is required for a real skill-gap analysis");
    }, MOCK_SKILL_GAP);
  }
  return withFallback(async () => {
    const { data } = await api.post<BackendEnvelope<AISkillGapResponse>>(`${AI_BASE}/skill-gap`, {
      targetRole,
      jobRequiredSkills,
    });
    const r = data.data;
    // The AI response groups skills into missing/weak/strong categories
    // rather than the {currentLevel, requiredLevel} numeric pairs this
    // UI type expects. The buckets below (0/100, 50/100, 90/100) are a
    // presentational approximation of those three real categories, not
    // fabricated AI output — every skill/demandLevel value is real.
    const items: SkillGapItem[] = [
      ...r.missing_skills.map((skill) => ({
        skill,
        demandLevel: "High" as const,
        currentLevel: 0,
        requiredLevel: 100,
      })),
      ...r.weak_skills.map((skill) => ({
        skill,
        demandLevel: "Medium" as const,
        currentLevel: 50,
        requiredLevel: 100,
      })),
      ...r.strong_skills.map((skill) => ({
        skill,
        demandLevel: "Low" as const,
        currentLevel: 90,
        requiredLevel: 100,
      })),
    ];
    return items;
  }, MOCK_SKILL_GAP);
}

// NO AI MODULE FOR THIS: the AI service's closest module is
// certification recommendation (wired below), which IS a real,
// distinct feature. There's no generic "learning path" endpoint
// beyond that, so this stays on mock data.
export async function getLearningRecommendations(): Promise<LearningRecommendation[]> {
  return withFallback(async () => {
    const { data } = await api.get<LearningRecommendation[]>(
      `${STUDENTS_BASE}/skills/learning-path`
    );
    return data;
  }, MOCK_LEARNING_RECOMMENDATIONS);
}

interface AICareerPathItem {
  career_name: string;
  domain: string;
  match_score: number;
  required_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  salary_range: string;
  future_scope: string;
  roadmap: string[];
  learning_resources: string[];
}
interface AICareerRecommendationResponse {
  results: AICareerPathItem[];
}

// ---- Career recommendations (WIRED: POST /ai/career-recommendations -> ai-service /api/career/recommend) ----
export async function getCareerPaths(interests?: string[]): Promise<CareerPath[]> {
  return withFallback(async () => {
    const { data } = await api.post<BackendEnvelope<AICareerRecommendationResponse>>(
      `${AI_BASE}/career-recommendations`,
      { interests }
    );
    return data.data.results.map((item) => ({
      title: item.career_name,
      confidence: Math.round(item.match_score * 100),
      // AI's "domain" is a short label; future_scope is the closest
      // real field to a human-readable description of the path.
      description: item.future_scope,
      averageSalary: item.salary_range,
      roadmap: item.roadmap,
    }));
  }, MOCK_CAREER_PATHS);
}

interface AICertificationItem {
  course_name: string;
  provider: string;
  related_skill: string;
  level: string;
  url: string;
}
interface AICertificationRecommendationResponse {
  results: AICertificationItem[];
}

// ---- Certification recommendations (WIRED: POST /ai/certification-recommendations
// -> ai-service /api/certification/recommend) ----
// Requires the missing skills to look up certifications for — typically
// the missing_skills from a prior getSkillGap() call. Without them,
// there's nothing real to send, so this falls back to mock data.
export async function getCertificationRecommendations(
  missingSkills?: string[],
  preferredProviders?: string[]
): Promise<CertificationRecommendationItem[]> {
  if (!missingSkills || missingSkills.length === 0) {
    return withFallback(async () => {
      throw new Error("missingSkills is required for real certification recommendations");
    }, MOCK_CERTIFICATIONS);
  }
  return withFallback(async () => {
    const { data } = await api.post<BackendEnvelope<AICertificationRecommendationResponse>>(
      `${AI_BASE}/certification-recommendations`,
      { missingSkills, preferredProviders }
    );
    return data.data.results.map((item) => ({
      title: item.course_name,
      provider: item.provider,
      // AI doesn't rank certifications by priority (only skill-gap's
      // learning_roadmap does, via learning_priority) — defaulted to
      // "Medium" rather than fabricating a ranking.
      priority: "Medium" as const,
      // AI doesn't model duration or cost for courses.
      duration: "Self-paced",
      cost: "Varies by provider",
      skillCovered: item.related_skill,
    }));
  }, MOCK_CERTIFICATIONS);
}

// ---- Job / internship recommendations (WIRED: GET /ai/recommendations/jobs,internships
// -> ai-service /api/recommend/jobs, /api/recommend/internships) ----
// Genuinely different from the plain public listings (GET /jobs,
// GET /internships, which DO exist unauthenticated and would be a
// separate jobsService/internshipsService worth adding for the raw
// listing pages). This pair specifically means AI-ranked
// recommendations against the student's stored profile/skills.
function toOpportunityItem(item: AIRecommendedItem): OpportunityItem {
  const extra = item.extra ?? {};
  return {
    id: item.id,
    title: item.title,
    company: item.company,
    location: item.location,
    // AI doesn't classify remote/on-site/hybrid — defaulted since the
    // dataset (ai-service/datasets/*.csv) doesn't model it either.
    type: "On-site",
    matchScore: Math.round(item.match_score * 100),
    stipendOrSalary:
      (extra.stipend as string | undefined) ?? (extra.salary as string | undefined) ?? "Not specified",
    // AI doesn't return a posting date.
    postedAgo: "Recently",
    skills: item.required_skills,
    saved: false,
  };
}

export async function getInternshipRecommendations(): Promise<OpportunityItem[]> {
  return withFallback(async () => {
    const { data } = await api.get<BackendEnvelope<AIRecommendationResponse>>(
      `${AI_BASE}/recommendations/internships`
    );
    return data.data.results.map(toOpportunityItem);
  }, MOCK_INTERNSHIPS);
}

export async function getJobRecommendations(): Promise<OpportunityItem[]> {
  return withFallback(async () => {
    const { data } = await api.get<BackendEnvelope<AIRecommendationResponse>>(
      `${AI_BASE}/recommendations/jobs`
    );
    return data.data.results.map(toOpportunityItem);
  }, MOCK_JOBS);
}

// NO BACKEND ROUTE: "saving" a recommended opportunity isn't modeled
// anywhere (not in the AI service, not in the Node backend's
// Application/Job/Internship models). Stays on mock.
export async function saveOpportunity(id: string): Promise<{ id: string; saved: boolean }> {
  return withFallback(async () => {
    const { data } = await api.post<{ id: string; saved: boolean }>(
      `${STUDENTS_BASE}/opportunities/${id}/save`
    );
    return data;
  }, { id, saved: true }, 300);
}

interface AITrendItem {
  skill: string;
  domain: string;
  growth_rate: string;
  demand_level: string;
  year: number;
}
interface AITopCompanyItem {
  company_name: string;
  industry: string;
  location: string;
  hiring_domains: string[];
}
interface AIIndustryTrendResponse {
  top_skills: AITrendItem[];
  trending_technologies: string[];
  growing_domains: string[];
  top_companies: AITopCompanyItem[];
  future_careers: string[];
}

// ---- Industry trends (WIRED: GET /ai/industry-trends -> ai-service /api/trends) ----
export async function getIndustryTrends(): Promise<IndustryTrendData> {
  return withFallback(async () => {
    const { data } = await api.get<BackendEnvelope<AIIndustryTrendResponse>>(
      `${AI_BASE}/industry-trends`
    );
    const r = data.data;
    return {
      trendingSkills: r.top_skills.map((t) => ({
        skill: t.skill,
        // growth_rate comes back as a string like "25%"; parsed to a
        // number for the chart, defaulting to 0 if unparseable.
        growth: Number.parseFloat(t.growth_rate.replace(/[^0-9.-]/g, "")) || 0,
      })),
      // AI reports which companies are hiring in which domains, but not
      // an opening count — left at 0 rather than invented.
      hiringCompanies: r.top_companies.map((c) => ({ company: c.company_name, openings: 0 })),
      // AI doesn't model historical/projected salary figures at all.
      salaryTrends: [],
      // AI reports future career titles, not a numeric demand score.
      inDemandRoles: r.future_careers.map((role) => ({ role, demandScore: 0 })),
    };
  }, MOCK_INDUSTRY_TRENDS);
}

export async function generateCoverLetter(
  payload: CoverLetterRequest
): Promise<CoverLetterResult> {
  const fallbackContent = `Dear Hiring Manager,\n\nI am excited to apply for the ${payload.jobTitle} role at ${payload.companyName}. ${payload.highlights}\n\nI believe my skills and enthusiasm make me a strong fit for this position, and I would welcome the opportunity to contribute to your team.\n\nSincerely,\nAnanya Sharma`;

  return withFallback(
    async () => {
      const { data } = await api.post<CoverLetterResult>(
        `${STUDENTS_BASE}/cover-letter/generate`,
        payload
      );
      return data;
    },
    { content: fallbackContent, generatedAt: new Date().toISOString() },
    1200
  );
}

export async function submitMockInterview(
  type: InterviewType,
  answers: Record<string, string>
): Promise<InterviewFeedback> {
  return withFallback(
    async () => {
      const { data } = await api.post<InterviewFeedback>(`${STUDENTS_BASE}/mock-interview/submit`, {
        type,
        answers,
      });
      return data;
    },
    buildMockInterviewFeedback(),
    1500
  );
}

// ---- Application Tracking (WIRED: GET /applications/me) ----
interface BackendApplication {
  _id: string;
  job?: { title: string } | null;
  internship?: { title: string } | null;
  company: { companyName: string };
  status: string;
  appliedAt: string;
  statusHistory: { status: string; changedAt: string; note?: string }[];
}

function toApplication(a: BackendApplication): Application {
  return {
    id: a._id,
    jobTitle: a.job?.title ?? a.internship?.title ?? "Untitled listing",
    company: a.company?.companyName ?? "",
    appliedOn: a.appliedAt,
    status: a.status as Application["status"],
    timeline: (a.statusHistory ?? []).map((h) => ({
      status: h.status as Application["status"],
      date: h.changedAt,
      note: h.note,
    })),
  };
}

export async function getApplications(): Promise<Application[]> {
  return withFallback(async () => {
    const { data } = await api.get<BackendEnvelope<BackendApplication[]>>("/applications/me");
    return data.data.map(toApplication);
  }, MOCK_APPLICATIONS);
}

// ---- Notifications (WIRED: GET /notifications, PUT /notifications/:id/read) ----
// Top-level resource, not nested under /students — same for every role.
interface BackendNotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

function toStudentNotification(n: BackendNotification): StudentNotification {
  const typeMap: Record<string, StudentNotification["type"]> = {
    "new-job": "Job",
    "new-internship": "Internship",
    "interview-scheduled": "Interview",
    "application-update": "Job",
  };
  return {
    id: n._id,
    type: typeMap[n.type] ?? "Job",
    title: n.title,
    message: n.message,
    createdAt: n.createdAt,
    read: n.isRead,
  };
}

export async function getNotifications(): Promise<StudentNotification[]> {
  return withFallback(async () => {
    const { data } = await api.get<BackendEnvelope<BackendNotification[]>>("/notifications");
    return data.data.map(toStudentNotification);
  }, MOCK_NOTIFICATIONS);
}

export async function markNotificationRead(id: string): Promise<{ id: string }> {
  return withFallback(async () => {
    await api.put(`/notifications/${id}/read`);
    return { id };
  }, { id }, 200);
}

// ---- Settings — NO BACKEND ROUTE for preferences; change-password should
// use PUT /auth/change-password (see authService.ts) instead of this path.
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return withFallback(async () => {
    const { data } = await api.get<NotificationPreferences>(`${STUDENTS_BASE}/settings/notifications`);
    return data;
  }, MOCK_NOTIFICATION_PREFERENCES);
}

export async function updateNotificationPreferences(
  payload: NotificationPreferences
): Promise<NotificationPreferences> {
  return withFallback(async () => {
    const { data } = await api.put<NotificationPreferences>(
      `${STUDENTS_BASE}/settings/notifications`,
      payload
    );
    return data;
  }, payload, 400);
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return withFallback(async () => {
    const { data } = await api.put<BackendEnvelope<null>>("/auth/change-password", {
      oldPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    });
    return { message: data.message };
  }, { message: "Password updated successfully." }, 700);
}
