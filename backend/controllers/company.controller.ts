import { Request, Response } from "express";
import Company from "../models/Company";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const getMyCompanyProfile = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");
  res.status(200).json(new ApiResponse("Company profile fetched", company));
});

export const updateMyCompanyProfile = catchAsync(async (req: Request, res: Response) => {
  const allowedFields = ["companyName", "industry", "website", "description", "phone", "address"];
  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const company = await Company.findOneAndUpdate({ user: req.user!.id }, updates, {
    new: true,
    runValidators: true,
  });
  if (!company) throw new ApiError(404, "Company profile not found");

  res.status(200).json(new ApiResponse("Company profile updated", company));
});

export const uploadCompanyLogo = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(400, "No logo uploaded");

  const company = await Company.findOneAndUpdate(
    { user: req.user!.id },
    { logo: `/uploads/company/${req.file.filename}` },
    { new: true }
  );
  if (!company) throw new ApiError(404, "Company profile not found");

  res.status(200).json(new ApiResponse("Logo updated", company));
});

export const getAllCompanies = catchAsync(async (req: Request, res: Response) => {
  const { industry, isApproved, page = 1, limit = 20 } = req.query;
  const filter: Record<string, unknown> = {};
  if (industry) filter.industry = industry;
  if (isApproved !== undefined) filter.isApproved = isApproved === "true";

  const companies = await Company.find(filter)
    .populate("user", "name email")
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Company.countDocuments(filter);

  res.status(200).json(
    new ApiResponse("Companies fetched", {
      companies,
      pagination: { total, page: Number(page), limit: Number(limit) },
    })
  );
});

export const getCompanyById = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findById(req.params.id)
    .populate("user", "name email")
    .populate("jobs")
    .populate("internships");
  if (!company) throw new ApiError(404, "Company not found");
  res.status(200).json(new ApiResponse("Company fetched", company));
});

export const approveCompany = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );
  if (!company) throw new ApiError(404, "Company not found");
  res.status(200).json(new ApiResponse("Company approved", company));
});
