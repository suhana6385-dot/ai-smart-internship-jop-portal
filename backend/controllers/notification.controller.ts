import { Request, Response } from "express";
import Notification from "../models/Notification";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const filter: Record<string, unknown> = { recipient: req.user!.id };
  if (unreadOnly === "true") filter.isRead = false;

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const unreadCount = await Notification.countDocuments({ recipient: req.user!.id, isRead: false });

  res.status(200).json(new ApiResponse("Notifications fetched", { notifications, unreadCount }));
});

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user!.id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, "Notification not found");
  res.status(200).json(new ApiResponse("Notification marked as read", notification));
});

export const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  await Notification.updateMany({ recipient: req.user!.id, isRead: false }, { isRead: true });
  res.status(200).json(new ApiResponse("All notifications marked as read"));
});

export const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user!.id,
  });
  if (!notification) throw new ApiError(404, "Notification not found");
  res.status(200).json(new ApiResponse("Notification deleted"));
});
