import { Router } from "express";
import {
  getAllUsers,
  toggleUserActive,
  deleteUser,
  getPendingCompanies,
  getDashboardOverview,
} from "../controllers/admin.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardOverview);
router.get("/users", getAllUsers);
router.put("/users/:id/toggle-active", toggleUserActive);
router.delete("/users/:id", deleteUser);
router.get("/companies/pending", getPendingCompanies);

export default router;
