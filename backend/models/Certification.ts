import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICertification extends Document {
  student: Types.ObjectId;
  title: string;
  issuedBy: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialUrl?: string;
  certificateFile?: string;
  createdAt: Date;
}

const certificationSchema = new Schema<ICertification>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    title: { type: String, required: true },
    issuedBy: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date },
    credentialUrl: { type: String },
    certificateFile: { type: String },
  },
  { timestamps: true }
);

const Certification: Model<ICertification> = mongoose.model<ICertification>(
  "Certification",
  certificationSchema
);
export default Certification;
