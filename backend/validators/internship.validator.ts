import { z } from "zod";

export const createInternshipSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  requiredSkills: z.array(z.string()).optional(),
  duration: z.string().min(1),
  stipend: z.number().nonnegative().optional(),
  isPaid: z.boolean().default(true),
  location: z.string().min(2),
  eligibleDepartments: z.array(z.string()).optional(),
  minCgpa: z.number().min(0).max(10).optional(),
  applicationDeadline: z.string().or(z.date()),
  startDate: z.string().or(z.date()).optional(),
  vacancies: z.number().positive().default(1),
});

export const updateInternshipSchema = createInternshipSchema.partial();
