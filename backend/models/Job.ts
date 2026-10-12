import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type JobType = "full-time" | "part-time" | "contract" | "remote";
export type JobStatus = "open" | "closed" | "draft";

export interface IJob extends Document {
  company: Types.ObjectId;
  title: string;
  description: string;
  requiredSkills: Types.ObjectId[];
  jobType: JobType;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceRequired: string;
  eligibleDepartments: string[];
  minCgpa?: number;
  applicationDeadline: Date;
  status: JobStatus;
  vacancies: number;
  applications: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "remote"],
      default: "full-time",
    },
    location: { type: String, required: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    experienceRequired: { type: String, default: "Fresher" },
    eligibleDepartments: [{ type: String }],
    minCgpa: { type: Number, default: 0 },
    applicationDeadline: { type: Date, required: true },
    status: { type: String, enum: ["open", "closed", "draft"], default: "open" },
    vacancies: { type: Number, default: 1 },
    applications: [{ type: Schema.Types.ObjectId, ref: "Application" }],
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text" });

const Job: Model<IJob> = mongoose.model<IJob>("Job", jobSchema);
export default Job;
