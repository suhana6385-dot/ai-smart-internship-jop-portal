import { Router } from "express";
import {
  createInternship,
  updateInternship,
  deleteInternship,
  getAllInternships,
  getInternshipById,
  getMyCompanyInternships,
} from "../controllers/internship.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createInternshipSchema, updateInternshipSchema } from "../validators/internship.validator";

const router = Router();

router.get("/", getAllInternships);
router.get("/:id", getInternshipById);

router.use(protect);

router.post("/", authorize("company"), validate(createInternshipSchema), createInternship);
router.get("/company/mine", authorize("company"), getMyCompanyInternships);
router.put("/:id", authorize("company"), validate(updateInternshipSchema), updateInternship);
router.delete("/:id", authorize("company"), deleteInternship);

export default router;
