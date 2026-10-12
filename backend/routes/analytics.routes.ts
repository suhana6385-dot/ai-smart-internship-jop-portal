import { Router } from "express";
import {
  getPlacementStats,
  getDepartmentStats,
  getApplicationStatusBreakdown,
  getMonthlyApplicationTrend,
} from "../controllers/analytics.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/placement-stats", getPlacementStats);
router.get("/department-stats", getDepartmentStats);
router.get("/application-status", getApplicationStatusBreakdown);
router.get("/monthly-trend", getMonthlyApplicationTrend);

export default router;
