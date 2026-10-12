import Student from "../models/Student";
import Company from "../models/Company";
import Job from "../models/Job";
import Internship from "../models/Internship";
import Application from "../models/Application";

export const computePlacementStats = async () => {
  const [totalStudents, totalCompanies, totalJobs, totalInternships, totalApplications, totalSelected, totalRejected] =
    await Promise.all([
      Student.countDocuments(),
      Company.countDocuments(),
      Job.countDocuments(),
      Internship.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "selected" }),
      Application.countDocuments({ status: "rejected" }),
    ]);

  const placementRate =
    totalStudents > 0 ? Number(((totalSelected / totalStudents) * 100).toFixed(2)) : 0;

  return {
    totalStudents,
    totalCompanies,
    totalJobs,
    totalInternships,
    totalApplications,
    totalSelected,
    totalRejected,
    placementRate,
  };
};

export const departmentWiseStats = async () => {
  return Student.aggregate([
    {
      $lookup: {
        from: "applications",
        localField: "_id",
        foreignField: "student",
        as: "applications",
      },
    },
    {
      $group: {
        _id: "$department",
        totalStudents: { $sum: 1 },
        totalApplications: { $sum: { $size: "$applications" } },
        placed: {
          $sum: {
            $size: {
              $filter: {
                input: "$applications",
                as: "app",
                cond: { $eq: ["$$app.status", "selected"] },
              },
            },
          },
        },
      },
    },
  ]);
};
