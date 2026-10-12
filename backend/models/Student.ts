import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IStudent extends Document {
  user: Types.ObjectId;
  rollNumber: string;
  department: string;
  batch: string;
  cgpa: number;
  phone: string;
  profileImage?: string;
  address?: string;
  skills: Types.ObjectId[];
  certifications: Types.ObjectId[];
  resumes: Types.ObjectId[];
  bio?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    department: { type: String, required: true },
    batch: { type: String, required: true },
    cgpa: { type: Number, min: 0, max: 10, default: 0 },
    phone: { type: String, required: true },
    profileImage: { type: String },
    address: { type: String },
    skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    certifications: [{ type: Schema.Types.ObjectId, ref: "Certification" }],
    resumes: [{ type: Schema.Types.ObjectId, ref: "Resume" }],
    bio: { type: String, maxlength: 500 },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
  },
  { timestamps: true }
);

const Student: Model<IStudent> = mongoose.model<IStudent>("Student", studentSchema);
export default Student;
