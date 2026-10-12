import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage as uploadProfileImageCtrl,
  addSkills,
  removeSkill,
  uploadResume as uploadResumeCtrl,
  getMyResumes,
  deleteResume,
  addCertification,
  getAllStudents,
  getStudentById,
} from "../controllers/student.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { uploadProfileImage, uploadResume } from "../config/multer";

const router = Router();

router.use(protect);

router.get("/me", authorize("student"), getMyProfile);
router.put("/me", authorize("student"), updateMyProfile);
router.post(
  "/me/profile-image",
  authorize("student"),
  uploadProfileImage.single("image"),
  uploadProfileImageCtrl
);

router.post("/me/skills", authorize("student"), addSkills);
router.delete("/me/skills/:skillId", authorize("student"), removeSkill);

router.post("/me/resumes", authorize("student"), uploadResume.single("resume"), uploadResumeCtrl);
router.get("/me/resumes", authorize("student"), getMyResumes);
router.delete("/me/resumes/:resumeId", authorize("student"), deleteResume);

router.post(
  "/me/certifications",
  authorize("student"),
  uploadProfileImage.single("certificateFile"),
  addCertification
);

// Company/Admin browsing students
router.get("/", authorize("company", "admin"), getAllStudents);
router.get("/:id", authorize("company", "admin"), getStudentById);

export default router;
