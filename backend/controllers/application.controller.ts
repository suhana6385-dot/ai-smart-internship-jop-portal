import { Request, Response } from "express";
import Application from "../models/Application";
import Student from "../models/Student";
import Company from "../models/Company";
import Job from "../models/Job";
import Internship from "../models/Internship";
import Resume from "../models/Resume";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { createNotification } from "../services/notification.service";
import { sendApplicationStatusEmail } from "../services/email.service";

export const applyToJobOrInternship = catchAsync(async (req: Request, res: Response) => {
  const { jobId, internshipId, resumeId, coverLetter } = req.body;
  if (!jobId && !internshipId) throw new ApiError(400, "Either jobId or internshipId is required");

  const student = await Student.findOne({ user: req.user!.id });
  if (!student) throw new ApiError(404, "Student profile not found");

  const resume = await Resume.findOne({ _id: resumeId, student: student._id });
  if (!resume) throw new ApiError(404, "Resume not found");

  let companyId;
  let postTitle = "";
  if (jobId) {
    const job = await Job.findById(jobId);
    if (!job || job.status !== "open") throw new ApiError(404, "Job not available");
    companyId = job.company;
    postTitle = job.title;
  } else {
    const internship = await Internship.findById(internshipId);
    if (!internship || internship.status !== "open") throw new ApiError(404, "Internship not available");
    companyId = internship.company;
    postTitle = internship.title;
  }

  const existing = await Application.findOne({
    student: student._id,
    ...(jobId ? { job: jobId } : { internship: internshipId }),
  });
  if (existing) throw new ApiError(409, "You have already applied to this posting");

  const application = await Application.create({
    student: student._id,
    job: jobId || undefined,
    internship: internshipId || undefined,
    company: companyId,
    resume: resume._id,
    coverLetter,
    statusHistory: [{ status: "applied", changedAt: new Date() }],
  });

  if (jobId) await Job.findByIdAndUpdate(jobId, { $addToSet: { applications: application._id } });
  if (internshipId)
    await Internship.findByIdAndUpdate(internshipId, { $addToSet: { applications: application._id } });

  const company = await Company.findById(companyId);
  if (company) {
    createNotification({
      recipient: company.user,
      title: "New Application Received",
      message: `A student applied for ${postTitle}`,
      type: "application-update",
      link: `/applications/${application._id}`,
    }).catch(() => undefined);
  }

  res.status(201).json(new ApiResponse("Application submitted", application));
});

export const getMyApplications = catchAsync(async (req: Request, res: Response) => {
  const student = await Student.findOne({ user: req.user!.id });
  if (!student) throw new ApiError(404, "Student profile not found");

  const applications = await Application.find({ student: student._id })
    .populate("job")
    .populate("internship")
    .populate("company", "companyName logo")
    .populate("resume")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse("Applications fetched", applications));
});

export const withdrawApplication = catchAsync(async (req: Request, res: Response) => {
  const student = await Student.findOne({ user: req.user!.id });
  if (!student) throw new ApiError(404, "Student profile not found");

  const application = await Application.findOneAndUpdate(
    { _id: req.params.id, student: student._id },
    {
      status: "withdrawn",
      $push: { statusHistory: { status: "withdrawn", changedAt: new Date() } },
    },
    { new: true }
  );
  if (!application) throw new ApiError(404, "Application not found");

  res.status(200).json(new ApiResponse("Application withdrawn", application));
});

export const getCompanyApplications = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");

  const { jobId, internshipId, status } = req.query;
  const filter: Record<string, unknown> = { company: company._id };
  if (jobId) filter.job = jobId;
  if (internshipId) filter.internship = internshipId;
  if (status) filter.status = status;

  const applications = await Application.find(filter)
    .populate({ path: "student", populate: { path: "user", select: "name email" } })
    .populate("job", "title")
    .populate("internship", "title")
    .populate("resume")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse("Applications fetched", applications));
});

export const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");

  const { status, note } = req.body;

  const application = await Application.findOneAndUpdate(
    { _id: req.params.id, company: company._id },
    {
      status,
      $push: { statusHistory: { status, changedAt: new Date(), note } },
    },
    { new: true }
  )
    .populate({ path: "student", populate: { path: "user", select: "name email" } })
    .populate("job", "title")
    .populate("internship", "title");

  if (!application) throw new ApiError(404, "Application not found");

  const studentUser: any = (application.student as any).user;
  const postTitle = (application.job as any)?.title || (application.internship as any)?.title;

  createNotification({
    recipient: studentUser._id,
    title: "Application Status Updated",
    message: `Your application for ${postTitle} is now: ${status}`,
    type: "application-update",
    link: `/applications/${application._id}`,
  }).catch(() => undefined);

  sendApplicationStatusEmail(studentUser.email, studentUser.name, postTitle, status).catch(
    () => undefined
  );

  res.status(200).json(new ApiResponse("Application status updated", application));
});
