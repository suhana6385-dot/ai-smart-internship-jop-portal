import { Request, Response } from "express";
import User from "../models/User";
import Student from "../models/Student";
import Company from "../models/Company";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../config/jwt";
import { sendWelcomeEmail } from "../services/email.service";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, password, role });

  // Auto-create linked profile skeleton
  if (role === "student") {
    await Student.create({
      user: user._id,
      rollNumber: `TEMP-${user._id.toString().slice(-6)}`,
      department: "Not Set",
      batch: "Not Set",
      phone: "0000000000",
    });
  } else if (role === "company") {
    await Company.create({
      user: user._id,
      companyName: name,
      industry: "Not Set",
      phone: "0000000000",
    });
  }

  const payload = { id: user._id.toString(), role: user.role, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  sendWelcomeEmail(user.email, user.name).catch(() => undefined);

  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse("User registered successfully", {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        accessToken,
        refreshToken,
      })
    );
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  if (!user.isActive) throw new ApiError(403, "Account is deactivated. Contact admin.");

  const payload = { id: user._id.toString(), role: user.role, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse("Login successful", {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        accessToken,
        refreshToken,
      })
    );
});

export const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const incomingToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (!incomingToken) throw new ApiError(401, "Refresh token missing");

  const decoded = verifyRefreshToken(incomingToken);
  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== incomingToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const payload = { id: user._id.toString(), role: user.role, email: user.email };
  const accessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  user.refreshToken = newRefreshToken;
  await user.save();

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(new ApiResponse("Token refreshed", { accessToken, refreshToken: newRefreshToken }));
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  if (req.user?.id) {
    await User.findByIdAndUpdate(req.user.id, { $unset: { refreshToken: 1 } });
  }
  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new ApiResponse("Logged out successfully"));
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse("Current user fetched", user));
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user!.id).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new ApiError(400, "Old password is incorrect");

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse("Password changed successfully"));
});
