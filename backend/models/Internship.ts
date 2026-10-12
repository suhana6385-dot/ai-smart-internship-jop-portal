import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type InternshipStatus = "open" | "closed" | "draft";

export interface IInternship extends Document {
  company: Types.ObjectId;
  title: string;
  description: string;
  requiredSkills: Types.ObjectId[];
  duration: string;
  stipend?: number;
  isPaid: boolean;
  location: string;
  eligibleDepartments: string[];
  minCgpa?: number;
  applicationDeadline: Date;
  startDate?: Date;
  status: InternshipStatus;
  vacancies: number;
  applications: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const internshipSchema = new Schema<IInternship>(
  {
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    duration: { type: String, required: true },
    stipend: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: true },
    location: { type: String, required: true },
    eligibleDepartments: [{ type: String }],
    minCgpa: { type: Number, default: 0 },
    applicationDeadline: { type: Date, required: true },
    startDate: { type: Date },
    status: { type: String, enum: ["open", "closed", "draft"], default: "open" },
    vacancies: { type: Number, default: 1 },
    applications: [{ type: Schema.Types.ObjectId, ref: "Application" }],
  },
  { timestamps: true }
);

internshipSchema.index({ title: "text", description: "text" });

const Internship: Model<IInternship> = mongoose.model<IInternship>("Internship", internshipSchema);
export default Internship;
