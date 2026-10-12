import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type NotificationType =
  | "application-update"
  | "new-job"
  | "new-internship"
  | "interview-scheduled"
  | "system"
  | "general";

export interface INotification extends Document {
  recipient: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "application-update",
        "new-job",
        "new-internship",
        "interview-scheduled",
        "system",
        "general",
      ],
      default: "general",
    },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

const Notification: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
export default Notification;
