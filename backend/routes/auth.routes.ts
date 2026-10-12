import { Router } from "express";
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe,
  changePassword,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema, changePasswordSchema } from "../validators/auth.validator";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/change-password", protect, validate(changePasswordSchema), changePassword);

export default router;
