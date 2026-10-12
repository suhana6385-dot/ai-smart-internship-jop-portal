import { Router } from "express";
import authRoutes from "./auth.routes";
import studentRoutes from "./student.routes";
import companyRoutes from "./company.routes";
import jobRoutes from "./job.routes";
import internshipRoutes from "./internship.routes";
import applicationRoutes from "./application.routes";
import interviewRoutes from "./interview.routes";
import notificationRoutes from "./notification.routes";
import adminRoutes from "./admin.routes";
import analyticsRoutes from "./analytics.routes";
import aiRoutes from "./ai.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/companies", companyRoutes);
router.use("/jobs", jobRoutes);
router.use("/internships", internshipRoutes);
router.use("/applications", applicationRoutes);
router.use("/interviews", interviewRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin", adminRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/ai", aiRoutes);

export default router;
