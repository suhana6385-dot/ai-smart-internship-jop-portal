import Notification, { NotificationType } from "../models/Notification";
import { getIO } from "../sockets";
import { Types } from "mongoose";

interface CreateNotificationInput {
  recipient: Types.ObjectId | string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
}

export const createNotification = async (input: CreateNotificationInput) => {
  const notification = await Notification.create(input);

  try {
    const io = getIO();
    io.to(`user:${input.recipient}`).emit("notification:new", notification);
  } catch {
    // Socket not initialized yet — safe to ignore
  }

  return notification;
};
