import { Request, Response } from "express";
import Job from "../models/Job";
import Company from "../models/Company";
import Student from "../models/Student";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { createNotification } from "../services/notification.service";

export const createJob = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");
  if (!company.isApproved) throw new ApiError(403, "Company not yet approved by admin");

  const job = await Job.create({ ...req.body, company: company._id });
  company.jobs.push(job._id);
  await company.save();

  // Notify eligible students (best-effort, non-blocking)
  Student.find({ department: { $in: job.eligibleDepartments } })
    .populate("user", "_id")
    .then((students) => {
      students.forEach((s: any) => {
        createNotification({
          recipient: s.user._id,
          title: "New Job Posted",
          message: `${company.companyName} posted a new job: ${job.title}`,
          type: "new-job",
          link: `/jobs/${job._id}`,
        }).catch(() => undefined);
      });
    })
    .catch(() => undefined);

  res.status(201).json(new ApiResponse("Job created", job));
});

export const updateJob = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");

  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, company: company._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) throw new ApiError(404, "Job not found");

  res.status(200).json(new ApiResponse("Job updated", job));
});

export const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");

  const job = await Job.findOneAndDelete({ _id: req.params.id, company: company._id });
  if (!job) throw new ApiError(404, "Job not found");

  res.status(200).json(new ApiResponse("Job deleted"));
});

export const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const { search, jobType, location, status = "open", page = 1, limit = 20 } = req.query;
  const filter: Record<string, unknown> = { status };
  if (jobType) filter.jobType = jobType;
  if (location) filter.location = new RegExp(String(location), "i");
  if (search) filter.$text = { $search: String(search) };

  const jobs = await Job.find(filter)
    .populate("company", "companyName logo industry")
    .populate("requiredSkills")
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Job.countDocuments(filter);

  res.status(200).json(
    new ApiResponse("Jobs fetched", { jobs, pagination: { total, page: Number(page), limit: Number(limit) } })
  );
});

export const getJobById = catchAsync(async (req: Request, res: Response) => {
  const job = await Job.findById(req.params.id)
    .populate("company", "companyName logo industry website")
    .populate("requiredSkills");
  if (!job) throw new ApiError(404, "Job not found");
  res.status(200).json(new ApiResponse("Job fetched", job));
});

export const getMyCompanyJobs = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");

  const jobs = await Job.find({ company: company._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse("Jobs fetched", jobs));
});
