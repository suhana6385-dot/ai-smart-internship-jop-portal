import { Router } from "express";
import {
  scheduleInterview,
  updateInterview,
  getMyInterviews,
  getCompanyInterviews,
} from "../controllers/interview.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(protect);

router.post("/", authorize("company"), scheduleInterview);
router.put("/:id", authorize("company"), updateInterview);
router.get("/me", authorize("student"), getMyInterviews);
router.get("/company", authorize("company"), getCompanyInterviews);

export default router;
