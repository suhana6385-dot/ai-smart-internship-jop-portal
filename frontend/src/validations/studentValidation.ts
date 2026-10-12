import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  headline: z.string().min(5, "Headline must be at least 5 characters").max(120),
  bio: z.string().max(500, "Keep your bio under 500 characters").optional().or(z.literal("")),
  location: z.string().min(2, "Location is required"),
  careerGoal: z.string().min(5, "Career goal is required"),
  skills: z.string().min(1, "Add at least one skill"),
  interests: z.string().min(1, "Add at least one interest"),
  linkedin: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  github: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;

export const coverLetterSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  tone: z.enum(["Formal", "Enthusiastic", "Concise"]),
  highlights: z
    .string()
    .min(10, "Add a few highlights so the letter feels personal")
    .max(600, "Keep highlights under 600 characters"),
});
export type CoverLetterFormValues = z.infer<typeof coverLetterSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
