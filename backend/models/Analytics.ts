import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalytics extends Document {
  date: Date;
  totalStudents: number;
  totalCompanies: number;
  totalJobs: number;
  totalInternships: number;
  totalApplications: number;
  totalSelected: number;
  totalRejected: number;
  placementRate: number;
  createdAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    date: { type: Date, default: Date.now, unique: true },
    totalStudents: { type: Number, default: 0 },
    totalCompanies: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    totalInternships: { type: Number, default: 0 },
    totalApplications: { type: Number, default: 0 },
    totalSelected: { type: Number, default: 0 },
    totalRejected: { type: Number, default: 0 },
    placementRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Analytics: Model<IAnalytics> = mongoose.model<IAnalytics>("Analytics", analyticsSchema);
export default Analytics;
