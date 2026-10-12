import { Router } from "express";
import {
  parseResume,
  getATSScore,
  skillGap,
  careerRecommendations,
  certificationRecommendations,
  interviewQuestions,
  jobRecommendations,
  internshipRecommendations,
  industryTrends,
  rankCandidates,
} from "../controllers/ai.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

/**
 * routes/ai.routes.ts
 * =====================
 * Mounted at /api/v1/ai (see routes/index.ts). Every route requires a
 * valid JWT (protect) so the AI service is never reachable by an
 * unauthenticated client through this backend. Role checks mirror who
 * the feature makes sense for in the frontend (student-facing AI
 * features vs. the company-facing candidate ranking tool).
 */

const router = Router();

router.use(protect);

// Student-facing AI features
router.get("/resume/parse", authorize("student"), parseResume);
router.get("/resume/ats-score", authorize("student"), getATSScore);
router.post("/skill-gap", authorize("student"), skillGap);
router.post("/career-recommendations", authorize("student"), careerRecommendations);
router.post("/certification-recommendations", authorize("student"), certificationRecommendations);
router.post("/interview-questions", authorize("student"), interviewQuestions);
router.get("/recommendations/jobs", authorize("student"), jobRecommendations);
router.get("/recommendations/internships", authorize("student"), internshipRecommendations);

// Available to any authenticated role
router.get("/industry-trends", industryTrends);

// Company-facing AI feature
router.post("/ranking", authorize("company"), rankCandidates);

export default router;
