import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interview-scheduled"
  | "selected"
  | "rejected"
  | "withdrawn";

export interface IApplication extends Document {
  student: Types.ObjectId;
  job?: Types.ObjectId;
  internship?: Types.ObjectId;
  company: Types.ObjectId;
  resume: Types.ObjectId;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt: Date;
  statusHistory: { status: ApplicationStatus; changedAt: Date; note?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    job: { type: Schema.Types.ObjectId, ref: "Job" },
    internship: { type: Schema.Types.ObjectId, ref: "Internship" },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    resume: { type: Schema.Types.ObjectId, ref: "Resume", required: true },
    coverLetter: { type: String, maxlength: 2000 },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview-scheduled", "selected", "rejected", "withdrawn"],
      default: "applied",
    },
    appliedAt: { type: Date, default: Date.now },
    statusHistory: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, job: 1 }, { unique: true, sparse: true });
applicationSchema.index({ student: 1, internship: 1 }, { unique: true, sparse: true });

const Application: Model<IApplication> = mongoose.model<IApplication>(
  "Application",
  applicationSchema
);
export default Application;
