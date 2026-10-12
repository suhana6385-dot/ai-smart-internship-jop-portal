import path from "path";
import { Request, Response } from "express";
import Student from "../models/Student";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import * as aiService from "../services/ai.service";

/**
 * controllers/ai.controller.ts
 * ==============================
 * Purpose:
 *   Gateway controllers between the frontend and the Python AI
 *   microservice. Each handler:
 *     1. Authenticates via `protect` (applied in routes/ai.routes.ts).
 *     2. Loads whatever data the AI request actually needs from
 *        MongoDB (the student's stored skills / resume file) —
 *        the frontend never has to know the AI service's request
 *        shape.
 *     3. Calls services/ai.service.ts.
 *     4. Returns the AI result wrapped in the same ApiResponse
 *        envelope used everywhere else in this backend.
 *
 *   No field here is invented: student_skills come from the real
 *   Student.skills relation, resumes come from the real Resume model
 *   populated by the existing POST /students/me/resumes upload flow.
 */

async function getStudentWithSkills(userId: string) {
  const student = await Student.findOne({ user: userId }).populate("skills").populate("resumes");
  if (!student) throw new ApiError(404, "Student profile not found");
  return student;
}

function resolveUploadPath(storedFilePath: string): string {
  // storedFilePath looks like "/uploads/resumes/172839-xyz.pdf" (see
  // student.controller.ts:uploadResume). Uploads are served from
  // backend/uploads (app.ts: app.use("/uploads", express.static(...))),
  // so the file on disk is backend/<storedFilePath>.
  return path.join(__dirname, "..", storedFilePath.replace(/^\/+/, ""));
}

function getPrimaryResume(student: { resumes: Array<{ isPrimary: boolean; filePath: string; fileName: string }> }) {
  const resumes = student.resumes || [];
  if (resumes.length === 0) {
    throw new ApiError(404, "No resume uploaded yet. Upload a resume before using this feature.");
  }
  return resumes.find((r) => r.isPrimary) || resumes[0];
}

// ---- Resume parsing: GET /ai/resume/parse ----
export const parseResume = catchAsync(async (req: Request, res: Response) => {
  const student = await getStudentWithSkills(req.user!.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resume = getPrimaryResume(student as any);
  const result = await aiService.parseResumeFile(resolveUploadPath(resume.filePath), resume.fileName);
  res.status(200).json(new ApiResponse("Resume parsed successfully", result));
});

// ---- ATS analysis: GET /ai/resume/ats-score?jobDescription= ----
export const getATSScore = catchAsync(async (req: Request, res: Response) => {
  const student = await getStudentWithSkills(req.user!.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resume = getPrimaryResume(student as any);
  const jobDescription = (req.query.jobDescription as string) || undefined;
  const result = await aiService.analyzeResumeATS(
    resolveUploadPath(resume.filePath),
    resume.fileName,
    jobDescription
  );
  res.status(200).json(new ApiResponse("ATS analysis completed", result));
});

// ---- Skill gap: POST /ai/skill-gap { targetRole, jobRequiredSkills } ----
export const skillGap = catchAsync(async (req: Request, res: Response) => {
  const { targetRole, jobRequiredSkills } = req.body as {
    targetRole?: string;
    jobRequiredSkills?: string[];
  };
  if (!Array.isArray(jobRequiredSkills) || jobRequiredSkills.length === 0) {
    throw new ApiError(400, "jobRequiredSkills must be a non-empty array");
  }

  const student = await getStudentWithSkills(req.user!.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studentSkills = ((student as any).skills || []).map((s: { name: string }) => s.name);
  if (studentSkills.length === 0) {
    throw new ApiError(400, "Add at least one skill to your profile before running a skill gap analysis");
  }

  const result = await aiService.analyzeSkillGap({
    student_skills: studentSkills,
    job_required_skills: jobRequiredSkills,
    target_role: targetRole,
  });
  res.status(200).json(new ApiResponse("Skill gap analysis completed", result));
});

// ---- Career recommendations: POST /ai/career-recommendations { interests? } ----
export const careerRecommendations = catchAsync(async (req: Request, res: Response) => {
  const { interests } = req.body as { interests?: string[] };
  const student = await getStudentWithSkills(req.user!.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studentSkills = ((student as any).skills || []).map((s: { name: string }) => s.name);
  if (studentSkills.length === 0) {
    throw new ApiError(400, "Add at least one skill to your profile before requesting career recommendations");
  }

  const result = await aiService.recommendCareerPaths({ skills: studentSkills, interests });
  res.status(200).json(new ApiResponse("Career recommendations generated", result));
});

// ---- Certification recommendations: POST /ai/certification-recommendations { missingSkills, preferredProviders? } ----
export const certificationRecommendations = catchAsync(async (req: Request, res: Response) => {
  const { missingSkills, preferredProviders } = req.body as {
    missingSkills?: string[];
    preferredProviders?: string[];
  };
  if (!Array.isArray(missingSkills) || missingSkills.length === 0) {
    throw new ApiError(400, "missingSkills must be a non-empty array");
  }

  const result = await aiService.recommendCertifications({
    missing_skills: missingSkills,
    preferred_providers: preferredProviders,
  });
  res.status(200).json(new ApiResponse("Certification recommendations generated", result));
});

// ---- Interview question generation: POST /ai/interview-questions ----
export const interviewQuestions = catchAsync(async (req: Request, res: Response) => {
  const { role, difficulty, numTechnical, numHr, numCoding, numMcq, numBehavioral } = req.body as {
    role?: string;
    difficulty?: "Easy" | "Medium" | "Hard";
    numTechnical?: number;
    numHr?: number;
    numCoding?: number;
    numMcq?: number;
    numBehavioral?: number;
  };

  const student = await getStudentWithSkills(req.user!.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studentSkills = ((student as any).skills || []).map((s: { name: string }) => s.name);
  if (studentSkills.length === 0) {
    throw new ApiError(400, "Add at least one skill to your profile before generating interview questions");
  }

  const result = await aiService.generateInterviewQuestions({
    skills: studentSkills,
    role,
    difficulty,
    num_technical: numTechnical,
    num_hr: numHr,
    num_coding: numCoding,
    num_mcq: numMcq,
    num_behavioral: numBehavioral,
  });
  res.status(200).json(new ApiResponse("Interview questions generated", result));
});

// ---- Job / internship recommendations ----
async function buildRecommendationPayload(req: Request) {
  const student = await getStudentWithSkills(req.user!.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = student as any;
  const studentSkills = (s.skills || []).map((sk: { name: string }) => sk.name);
  if (studentSkills.length === 0) {
    throw new ApiError(400, "Add at least one skill to your profile before requesting recommendations");
  }
  const { domain, location, topN } = req.query as { domain?: string; location?: string; topN?: string };
  return {
    skills: studentSkills,
    education: s.department || undefined,
    preferred_location: location || s.address || undefined,
    preferred_domain: domain || undefined,
    top_n: topN ? Number(topN) : undefined,
  };
}

export const jobRecommendations = catchAsync(async (req: Request, res: Response) => {
  const payload = await buildRecommendationPayload(req);
  const result = await aiService.recommendJobs(payload);
  res.status(200).json(new ApiResponse("Job recommendations generated", result));
});

export const internshipRecommendations = catchAsync(async (req: Request, res: Response) => {
  const payload = await buildRecommendationPayload(req);
  const result = await aiService.recommendInternships(payload);
  res.status(200).json(new ApiResponse("Internship recommendations generated", result));
});

// ---- Industry trends: GET /ai/industry-trends?domain=&topN= ----
export const industryTrends = catchAsync(async (req: Request, res: Response) => {
  const { domain, topN } = req.query as { domain?: string; topN?: string };
  const result = await aiService.getIndustryTrends(domain, topN ? Number(topN) : undefined);
  res.status(200).json(new ApiResponse("Industry trends retrieved", result));
});

// ---- Candidate ranking (company): POST /ai/ranking { candidates, weights? } ----
export const rankCandidates = catchAsync(async (req: Request, res: Response) => {
  const { candidates, weights } = req.body as {
    candidates?: aiService.CandidateRankingPayload["candidates"];
    weights?: Record<string, number>;
  };
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new ApiError(400, "candidates must be a non-empty array");
  }
  const result = await aiService.rankCandidates({ candidates, weights });
  res.status(200).json(new ApiResponse("Candidates ranked", result));
});
