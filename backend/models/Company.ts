import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICompany extends Document {
  user: Types.ObjectId;
  companyName: string;
  industry: string;
  website?: string;
  logo?: string;
  description?: string;
  phone: string;
  address?: string;
  isApproved: boolean;
  jobs: Types.ObjectId[];
  internships: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    industry: { type: String, required: true },
    website: { type: String },
    logo: { type: String },
    description: { type: String, maxlength: 1000 },
    phone: { type: String, required: true },
    address: { type: String },
    isApproved: { type: Boolean, default: false },
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    internships: [{ type: Schema.Types.ObjectId, ref: "Internship" }],
  },
  { timestamps: true }
);

const Company: Model<ICompany> = mongoose.model<ICompany>("Company", companySchema);
export default Company;
