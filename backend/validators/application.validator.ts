import { z } from "zod";

export const applyJobSchema = z.object({
  jobId: z.string().optional(),
  internshipId: z.string().optional(),
  resumeId: z.string(),
  coverLetter: z.string().max(2000).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    "applied",
    "shortlisted",
    "interview-scheduled",
    "selected",
    "rejected",
    "withdrawn",
  ]),
  note: z.string().max(500).optional(),
});
