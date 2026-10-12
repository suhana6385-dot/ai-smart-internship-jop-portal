import { Request, Response } from "express";
import Interview from "../models/Interview";
import Application from "../models/Application";
import Company from "../models/Company";
import Student from "../models/Student";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { createNotification } from "../services/notification.service";
import { sendInterviewScheduledEmail } from "../services/email.service";

export const scheduleInterview = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");

  const { applicationId, scheduledAt, mode, location, meetingLink, interviewerName } = req.body;

  const application = await Application.findOne({ _id: applicationId, company: company._id }).populate(
    { path: "student", populate: { path: "user", select: "name email" } }
  );
  if (!application) throw new ApiError(404, "Application not found");

  const interview = await Interview.create({
    application: application._id,
    student: application.student,
    company: company._id,
    scheduledAt,
    mode,
    location,
    meetingLink,
    interviewerName,
  });

  application.status = "interview-scheduled";
  application.statusHistory.push({ status: "interview-scheduled", changedAt: new Date() });
  await application.save();

  const studentUser: any = (application.student as any).user;
  createNotification({
    recipient: studentUser._id,
    title: "Interview Scheduled",
    message: `Your interview has been scheduled on ${new Date(scheduledAt).toLocaleString()}`,
    type: "interview-scheduled",
    link: `/interviews/${interview._id}`,
  }).catch(() => undefined);

  sendInterviewScheduledEmail(studentUser.email, studentUser.name, "your application", new Date(scheduledAt)).catch(
    () => undefined
  );

  res.status(201).json(new ApiResponse("Interview scheduled", interview));
});

export const updateInterview = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");

  const interview = await Interview.findOneAndUpdate(
    { _id: req.params.id, company: company._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!interview) throw new ApiError(404, "Interview not found");

  res.status(200).json(new ApiResponse("Interview updated", interview));
});

export const getMyInterviews = catchAsync(async (req: Request, res: Response) => {
  const student = await Student.findOne({ user: req.user!.id });
  if (!student) throw new ApiError(404, "Student profile not found");

  const interviews = await Interview.find({ student: student._id })
    .populate("company", "companyName logo")
    .populate("application")
    .sort({ scheduledAt: -1 });

  res.status(200).json(new ApiResponse("Interviews fetched", interviews));
});

export const getCompanyInterviews = catchAsync(async (req: Request, res: Response) => {
  const company = await Company.findOne({ user: req.user!.id });
  if (!company) throw new ApiError(404, "Company profile not found");

  const interviews = await Interview.find({ company: company._id })
    .populate({ path: "student", populate: { path: "user", select: "name email" } })
    .populate("application")
    .sort({ scheduledAt: -1 });

  res.status(200).json(new ApiResponse("Interviews fetched", interviews));
});
