import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type InterviewMode = "online" | "offline" | "phone";
export type InterviewStatus = "scheduled" | "completed" | "cancelled" | "rescheduled";

export interface IInterview extends Document {
  application: Types.ObjectId;
  student: Types.ObjectId;
  company: Types.ObjectId;
  scheduledAt: Date;
  mode: InterviewMode;
  location?: string;
  meetingLink?: string;
  interviewerName?: string;
  status: InterviewStatus;
  feedback?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    application: { type: Schema.Types.ObjectId, ref: "Application", required: true },
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    scheduledAt: { type: Date, required: true },
    mode: { type: String, enum: ["online", "offline", "phone"], default: "online" },
    location: { type: String },
    meetingLink: { type: String },
    interviewerName: { type: String },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
    feedback: { type: String, maxlength: 2000 },
    rating: { type: Number, min: 0, max: 5 },
  },
  { timestamps: true }
);

const Interview: Model<IInterview> = mongoose.model<IInterview>("Interview", interviewSchema);
export default Interview;
