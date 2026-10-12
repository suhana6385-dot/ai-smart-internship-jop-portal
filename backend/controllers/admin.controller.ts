import { Request, Response } from "express";
import User from "../models/User";
import Student from "../models/Student";
import Company from "../models/Company";
import Job from "../models/Job";
import Internship from "../models/Internship";
import Application from "../models/Application";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { role, page = 1, limit = 20 } = req.query;
  const filter: Record<string, unknown> = {};
  if (role) filter.role = role;

  const users = await User.find(filter)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  res.status(200).json(
    new ApiResponse("Users fetched", { users, pagination: { total, page: Number(page), limit: Number(limit) } })
  );
});

export const toggleUserActive = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json(new ApiResponse(`User ${user.isActive ? "activated" : "deactivated"}`, user));
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.role === "student") await Student.findOneAndDelete({ user: user._id });
  if (user.role === "company") await Company.findOneAndDelete({ user: user._id });

  res.status(200).json(new ApiResponse("User deleted"));
});

export const getPendingCompanies = catchAsync(async (_req: Request, res: Response) => {
  const companies = await Company.find({ isApproved: false }).populate("user", "name email");
  res.status(200).json(new ApiResponse("Pending companies fetched", companies));
});

export const getDashboardOverview = catchAsync(async (_req: Request, res: Response) => {
  const [totalStudents, totalCompanies, totalJobs, totalInternships, totalApplications, pendingApprovals] =
    await Promise.all([
      Student.countDocuments(),
      Company.countDocuments(),
      Job.countDocuments({ status: "open" }),
      Internship.countDocuments({ status: "open" }),
      Application.countDocuments(),
      Company.countDocuments({ isApproved: false }),
    ]);

  res.status(200).json(
    new ApiResponse("Dashboard overview fetched", {
      totalStudents,
      totalCompanies,
      totalJobs,
      totalInternships,
      totalApplications,
      pendingApprovals,
    })
  );
});
