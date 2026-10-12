import { Router } from "express";
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getMyCompanyJobs,
} from "../controllers/job.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createJobSchema, updateJobSchema } from "../validators/job.validator";

const router = Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);

router.use(protect);

router.post("/", authorize("company"), validate(createJobSchema), createJob);
router.get("/company/mine", authorize("company"), getMyCompanyJobs);
router.put("/:id", authorize("company"), validate(updateJobSchema), updateJob);
router.delete("/:id", authorize("company"), deleteJob);

export default router;
