import { Router } from "express";
import {
  applyToJobOrInternship,
  getMyApplications,
  withdrawApplication,
  getCompanyApplications,
  updateApplicationStatus,
} from "../controllers/application.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { applyJobSchema, updateApplicationStatusSchema } from "../validators/application.validator";

const router = Router();

router.use(protect);

router.post("/", authorize("student"), validate(applyJobSchema), applyToJobOrInternship);
router.get("/me", authorize("student"), getMyApplications);
router.put("/:id/withdraw", authorize("student"), withdrawApplication);

router.get("/company", authorize("company"), getCompanyApplications);
router.put(
  "/:id/status",
  authorize("company"),
  validate(updateApplicationStatusSchema),
  updateApplicationStatus
);

export default router;
