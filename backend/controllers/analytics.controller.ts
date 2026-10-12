import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import ApiResponse from "../utils/ApiResponse";
import { computePlacementStats, departmentWiseStats } from "../services/analytics.service";
import Application from "../models/Application";

export const getPlacementStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await computePlacementStats();
  res.status(200).json(new ApiResponse("Placement stats fetched", stats));
});

export const getDepartmentStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await departmentWiseStats();
  res.status(200).json(new ApiResponse("Department-wise stats fetched", stats));
});

export const getApplicationStatusBreakdown = catchAsync(async (_req: Request, res: Response) => {
  const breakdown = await Application.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  res.status(200).json(new ApiResponse("Application status breakdown fetched", breakdown));
});

export const getMonthlyApplicationTrend = catchAsync(async (_req: Request, res: Response) => {
  const trend = await Application.aggregate([
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  res.status(200).json(new ApiResponse("Monthly application trend fetched", trend));
});
