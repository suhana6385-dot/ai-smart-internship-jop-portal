import { Request, Response } from "express";
import Internship from "../models/Internship";
import Company from "../models/Company";
import Student from "../models/Student";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { createNotification } from "../services/notification.service";

export const createInternship = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");
  if (!company.isApproved) throw new ApiError(403, "Company not yet approved by admin");

  const internship = await Internship.create({ ...req.body, company: company._id });
  company.internships.push(internship._id);
  await company.save();

  Student.find({ department: { $in: internship.eligibleDepartments } })
    .populate("user", "_id")
    .then((students) => {
      students.forEach((s: any) => {
        createNotification({
          recipient: s.user._id,
          title: "New Internship Posted",
          message: `${company.companyName} posted a new internship: ${internship.title}`,
          type: "new-internship",
          link: `/internships/${internship._id}`,
        }).catch(() => undefined);
      });
    })
    .catch(() => undefined);

  res.status(201).json(new ApiResponse("Internship created", internship));
});

export const updateInternship = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");

  const internship = await Internship.findOneAndUpdate(
    { _id: req.params.id, company: company._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!internship) throw new ApiError(404, "Internship not found");

  res.status(200).json(new ApiResponse("Internship updated", internship));
});

export const deleteInternship = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");

  const internship = await Internship.findOneAndDelete({ _id: req.params.id, company: company._id });
  if (!internship) throw new ApiError(404, "Internship not found");

  res.status(200).json(new ApiResponse("Internship deleted"));
});

export const getAllInternships = catchAsync(async (req: Request, res: Response) => {
  const { search, location, isPaid, status = "open", page = 1, limit = 20 } = req.query;
  const filter: Record<string, unknown> = { status };
  if (location) filter.location = new RegExp(String(location), "i");
  if (isPaid !== undefined) filter.isPaid = isPaid === "true";
  if (search) filter.$text = { $search: String(search) };

  const internships = await Internship.find(filter)
    .populate("company", "companyName logo industry")
    .populate("requiredSkills")
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Internship.countDocuments(filter);

  res.status(200).json(
    new ApiResponse("Internships fetched", {
      internships,
      pagination: { total, page: Number(page), limit: Number(limit) },
    })
  );
});

export const getInternshipById = catchAsync(async (req: Request, res: Response) => {
  const internship = await Internship.findById(req.params.id)
    .populate("company", "companyName logo industry website")
    .populate("requiredSkills");
  if (!internship) throw new ApiError(404, "Internship not found");
  res.status(200).json(new ApiResponse("Internship fetched", internship));
});

export const getMyCompanyInternships = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");

  const internships = await Internship.find({ company: company._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse("Internships fetched", internships));
});
