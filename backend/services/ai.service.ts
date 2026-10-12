import fs from "fs";
import FormData from "form-data";
import aiServiceClient from "../config/aiService";
import ApiError from "../utils/ApiError";
import logger from "../utils/logger";

/**
 * services/ai.service.ts
 * =======================
 * Purpose:
 *   Single place that knows how to talk to every REAL endpoint exposed
 *   by the Python AI microservice (ai-service/api/*.py). Every function
 *   here maps 1:1 to an endpoint that actually exists in the uploaded
 *   AI service — nothing here is invented.
 *
 *   Endpoint map (verified against ai-service/api/*.py):
 *     POST /api/resume/parse            -> parseResumeFile
 *     POST /api/ats/analyze             -> analyzeResumeATS
 *     POST /api/skill-gap/analyze       -> analyzeSkillGap
 *     POST /api/recommend/jobs          -> recommendJobs
 *     POST /api/recommend/internships   -> recommendInternships
 *     POST /api/career/recommend        -> recommendCareerPaths
 *     POST /api/certification/recommend -> recommendCertifications
 *     POST /api/interview/generate      -> generateInterviewQuestions
 *     POST /api/ranking/rank            -> rankCandidates
 *     GET  /api/trends                  -> getIndustryTrends
 *
 * Error handling:
 *   The AI service uses the SAME response envelope as this backend
 *   ({ success, message, data, errors }), so a failed-but-200 response
 *   never happens (see ai-service/utils/response_formatter.py) — errors
 *   come back as non-2xx with that envelope, or as network/timeout
 *   errors when the process isn't running at all. Both are normalized
 *   into ApiError here so controllers can just await and let
 *   catchAsync/errorHandler take care of the rest.
 */

interface AIEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}

async function callAIService<T>(request: () => Promise<{ data: AIEnvelope<T> }>): Promise<T> {
  try {
    const { data } = await request();
    if (!data.success) {
      throw new ApiError(502, data.message || "AI service returned an error");
    }
    return data.data;
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;

    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
      logger.error(`AI service unreachable (${err.code}): ${err.message}`);
      throw new ApiError(503, "AI service is currently unavailable. Please try again shortly.");
    }

    if (err.response) {
      const status = typeof err.response.status === "number" ? err.response.status : 502;
      const message =
        err.response.data?.message || "The AI service rejected the request";
      throw new ApiError(status, message, err.response.data?.errors);
    }

    logger.error(`Unexpected error calling AI service: ${err.message}`);
    throw new ApiError(502, "Failed to communicate with the AI service");
  }
}

/** POST /api/resume/parse — multipart resume file -> structured resume data. */
export function parseResumeFile(filePath: string, originalFileName: string) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath), originalFileName);
  return callAIService(() =>
    aiServiceClient.post("/api/resume/parse", form, { headers: form.getHeaders() })
  );
}

/** POST /api/ats/analyze — multipart resume file (+ optional job description) -> ATS score breakdown. */
export function analyzeResumeATS(filePath: string, originalFileName: string, jobDescription?: string) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath), originalFileName);
  if (jobDescription) form.append("job_description", jobDescription);
  return callAIService(() =>
    aiServiceClient.post("/api/ats/analyze", form, { headers: form.getHeaders() })
  );
}

export interface SkillGapPayload {
  student_skills: string[];
  job_required_skills: string[];
  target_role?: string;
}
/** POST /api/skill-gap/analyze */
export function analyzeSkillGap(payload: SkillGapPayload) {
  return callAIService(() => aiServiceClient.post("/api/skill-gap/analyze", payload));
}

export interface RecommendationPayload {
  skills: string[];
  education?: string;
  resume_text?: string;
  preferred_location?: string;
  preferred_domain?: string;
  experience_years?: number;
  top_n?: number;
}
/** POST /api/recommend/jobs */
export function recommendJobs(payload: RecommendationPayload) {
  return callAIService(() => aiServiceClient.post("/api/recommend/jobs", payload));
}
/** POST /api/recommend/internships */
export function recommendInternships(payload: RecommendationPayload) {
  return callAIService(() => aiServiceClient.post("/api/recommend/internships", payload));
}

export interface CareerRecommendationPayload {
  skills: string[];
  interests?: string[];
  top_n?: number;
}
/** POST /api/career/recommend */
export function recommendCareerPaths(payload: CareerRecommendationPayload) {
  return callAIService(() => aiServiceClient.post("/api/career/recommend", payload));
}

export interface CertificationRecommendationPayload {
  missing_skills: string[];
  preferred_providers?: string[];
}
/** POST /api/certification/recommend */
export function recommendCertifications(payload: CertificationRecommendationPayload) {
  return callAIService(() => aiServiceClient.post("/api/certification/recommend", payload));
}

export interface InterviewGenerationPayload {
  skills: string[];
  role?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  num_technical?: number;
  num_hr?: number;
  num_coding?: number;
  num_mcq?: number;
  num_behavioral?: number;
}
/** POST /api/interview/generate */
export function generateInterviewQuestions(payload: InterviewGenerationPayload) {
  return callAIService(() => aiServiceClient.post("/api/interview/generate", payload));
}

export interface CandidateRankingPayload {
  candidates: Array<{
    candidate_id: string;
    name: string;
    ats_score: number;
    projects_count: number;
    cgpa: number;
    experience_years: number;
    certifications_count: number;
    skill_match_percentage: number;
    communication_score?: number;
    interview_score?: number;
  }>;
  weights?: Record<string, number>;
}
/** POST /api/ranking/rank */
export function rankCandidates(payload: CandidateRankingPayload) {
  return callAIService(() => aiServiceClient.post("/api/ranking/rank", payload));
}

/** GET /api/trends?domain=&top_n= */
export function getIndustryTrends(domain?: string, topN?: number) {
  return callAIService(() =>
    aiServiceClient.get("/api/trends", { params: { domain, top_n: topN } })
  );
}
