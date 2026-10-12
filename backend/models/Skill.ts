import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category?: string;
  createdAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, trim: true },
  },
  { timestamps: true }
);

const Skill: Model<ISkill> = mongoose.model<ISkill>("Skill", skillSchema);
export default Skill;
