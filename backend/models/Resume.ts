import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IResume extends Document {
  student: Types.ObjectId;
  fileName: string;
  filePath: string;
  fileSize: number;
  isPrimary: boolean;
  uploadedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, required: true },
    isPrimary: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Resume: Model<IResume> = mongoose.model<IResume>("Resume", resumeSchema);
export default Resume;
