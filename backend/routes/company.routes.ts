import { Router } from "express";
import {
  getMyCompanyProfile,
  updateMyCompanyProfile,
  uploadCompanyLogo as uploadCompanyLogoCtrl,
  getAllCompanies,
  getCompanyById,
  approveCompany,
} from "../controllers/company.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { uploadCompanyLogo } from "../config/multer";

const router = Router();

router.use(protect);

router.get("/me", authorize("company"), getMyCompanyProfile);
router.put("/me", authorize("company"), updateMyCompanyProfile);
router.post(
  "/me/logo",
  authorize("company"),
  uploadCompanyLogo.single("logo"),
  uploadCompanyLogoCtrl
);

router.get("/", authorize("student", "admin"), getAllCompanies);
router.get("/:id", authorize("student", "admin", "company"), getCompanyById);
router.put("/:id/approve", authorize("admin"), approveCompany);

export default router;
