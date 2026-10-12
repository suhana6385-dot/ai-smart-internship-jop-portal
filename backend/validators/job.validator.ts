import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  requiredSkills: z.array(z.string()).optional(),
  jobType: z.enum(["full-time", "part-time", "contract", "remote"]).default("full-time"),
  location: z.string().min(2),
  salaryMin: z.number().nonnegative().optional(),
  salaryMax: z.number().nonnegative().optional(),
  experienceRequired: z.string().optional(),
  eligibleDepartments: z.array(z.string()).optional(),
  minCgpa: z.number().min(0).max(10).optional(),
  applicationDeadline: z.string().or(z.date()),
  vacancies: z.number().positive().default(1),
});

export const updateJobSchema = createJobSchema.partial();
