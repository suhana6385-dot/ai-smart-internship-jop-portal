import { Request, Response } from "express";
import Student from "../models/Student";
import Resume from "../models/Resume";
import Certification from "../models/Certification";
import Skill from "../models/Skill";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const student = await Student.findOne({ user: req.user!.id })
    .populate("skills")
    .populate("certifications")
    .populate("resumes");
  if (!student) throw new ApiError(404, "Student profile not found");
  res.status(200).json(new ApiResponse("Profile fetched", student));
});

export const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const allowedFields = [
    "rollNumber",
    "department",
    "batch",
    "cgpa",
    "phone",
    "address",
    "bio",
    "linkedin",
    "github",
    "portfolio",
  ];
  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const student = await Student.findOneAndUpdate({ user: req.user!.id }, updates, {
    new: true,
    runValidators: true,
  });
  if (!student) throw new ApiError(404, "Student profile not found");

  res.status(200).json(new ApiResponse("Profile updated", student));
});

export const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(400, "No image uploaded");

  const student = await Student.findOneAndUpdate(
    { user: req.user!.id },
    { profileImage: `/uploads/profile/${req.file.filename}` },
    { new: true }
  );
  if (!student) throw new ApiError(404, "Student profile not found");

  res.status(200).json(new ApiResponse("Profile image updated", student));
});

export const addSkills = catchAsync(async (req: Request, res: Response) => {
  const { skills } = req.body as { skills: string[] };
  if (!Array.isArray(skills) || skills.length === 0) {
    throw new ApiError(400, "skills must be a non-empty array of skill names");
  }

  const skillIds = await Promise.all(
    skills.map(async (name) => {
      const skill = await Skill.findOneAndUpdate(
        { name: name.toLowerCase().trim() },
        { name: name.toLowerCase().trim() },
        { upsert: true, new: true }
      );
      return skill._id;
    })
  );

  const student = await Student.findOneAndUpdate(
    { user: req.user!.id },
    { $addToSet: { skills: { $each: skillIds } } },
    { new: true }
  ).populate("skills");

  if (!student) throw new ApiError(404, "Student profile not found");
  res.status(200).json(new ApiResponse("Skills added", student));
});

export const removeSkill = catchAsync(async (req: Request, res: Response) => {
  const student = await Student.findOneAndUpdate(
    { user: req.user!.id },
    { $pull: { skills: req.params.skillId } },
    { new: true }
  ).populate("skills");
  if (!student) throw new ApiError(404, "Student profile not found");
  res.status(200).json(new ApiResponse("Skill removed", student));
});

export const uploadResume = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(400, "No resume file uploaded");

  const student = await Student.findOne({ user: req.user!.id });
  if (!student) throw new ApiError(404, "Student profile not found");

  const resume = await Resume.create({
    student: student._id,
    fileName: req.file.originalname,
    filePath: `/uploads/resumes/${req.file.filename}`,
    fileSize: req.file.size,
    isPrimary: student.resumes.length === 0,
  });

  student.resumes.push(resume._id);
  await student.save();

  res.status(201).json(new ApiResponse("Resume uploaded", resume));
});

export const getMyResumes = catchAsync(async (req: Request, res: Response) => {
  const student = await Student.findOne({ user: req.user!.id });
  if (!student) throw new ApiError(404, "Student profile not found");

  const resumes = await Resume.find({ student: student._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse("Resumes fetched", resumes));
});

export const deleteResume = catchAsync(async (req: Request, res: Response) => {
  const student = await Student.findOne({ user: req.user!.id });
  if (!student) throw new ApiError(404, "Student profile not found");

  const resume = await Resume.findOneAndDelete({ _id: req.params.resumeId, student: student._id });
  if (!resume) throw new ApiError(404, "Resume not found");

  student.resumes = student.resumes.filter((id) => id.toString() !== req.params.resumeId);
  await student.save();

  res.status(200).json(new ApiResponse("Resume deleted"));
});

export const addCertification = catchAsync(async (req: Request, res: Response) => {
  const student = await Student.findOne({ user: req.user!.id });
  if (!student) throw new ApiError(404, "Student profile not found");

  const certification = await Certification.create({
    student: student._id,
    ...req.body,
    certificateFile: req.file ? `/uploads/profile/${req.file.filename}` : undefined,
  });

  student.certifications.push(certification._id);
  await student.save();

  res.status(201).json(new ApiResponse("Certification added", certification));
});

export const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const { department, batch, minCgpa, page = 1, limit = 20 } = req.query;
  const filter: Record<string, unknown> = {};
  if (department) filter.department = department;
  if (batch) filter.batch = batch;
  if (minCgpa) filter.cgpa = { $gte: Number(minCgpa) };

  const students = await Student.find(filter)
    .populate("user", "name email")
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Student.countDocuments(filter);

  res.status(200).json(
    new ApiResponse("Students fetched", {
      students,
      pagination: { total, page: Number(page), limit: Number(limit) },
    })
  );
});

export const getStudentById = catchAsync(async (req: Request, res: Response) => {
  const student = await Student.findById(req.params.id)
    .populate("user", "name email")
    .populate("skills")
    .populate("certifications")
    .populate("resumes");
  if (!student) throw new ApiError(404, "Student not found");
  res.status(200).json(new ApiResponse("Student fetched", student));
});
