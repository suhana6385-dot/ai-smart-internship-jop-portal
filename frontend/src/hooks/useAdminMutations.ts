import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteStudent,
  generateReport,
  markAdminNotificationRead,
  updateCompanyVerification,
  updateInternshipStatus,
  updateJobStatus,
  updatePlatformSettings,
  updateStudentStatus,
} from "@/services/adminService";
import { useAppDispatch } from "@/redux/hooks";
import { setPlatformSettings } from "@/redux/slices/adminSlice";

import type { AccountStatus, ListingStatus, VerificationStatus } from "@/types/admin";

export function useUpdateStudentStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AccountStatus }) =>
      updateStudentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      toast.success("Student status updated");
    },
    onError: () => toast.error("Couldn't update student status"),
  });
}

export function useDeleteStudentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      toast.success("Student removed");
    },
    onError: () => toast.error("Couldn't remove this student"),
  });
}

export function useUpdateCompanyVerificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, verification }: { id: string; verification: VerificationStatus }) =>
      updateCompanyVerification(id, verification),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-verifications"] });
      toast.success(`Company ${data.verification.toLowerCase()}`);
    },
    onError: () => toast.error("Couldn't update verification status"),
  });
}

export function useUpdateJobStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ListingStatus }) =>
      updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
      toast.success("Job status updated");
    },
    onError: () => toast.error("Couldn't update job status"),
  });
}

export function useUpdateInternshipStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ListingStatus }) =>
      updateInternshipStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "internships"] });
      toast.success("Internship status updated");
    },
    onError: () => toast.error("Couldn't update internship status"),
  });
}

export function useGenerateReportMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "generated-reports"] });
      toast.success("Report generated");
    },
    onError: () => toast.error("Couldn't generate the report"),
  });
}

export function useMarkAdminNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAdminNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });
}

export function useUpdatePlatformSettingsMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePlatformSettings,
    onSuccess: (data) => {
      dispatch(setPlatformSettings(data));
      queryClient.setQueryData(["admin", "settings"], data);
      toast.success("Platform settings saved");
    },
    onError: () => toast.error("Couldn't save platform settings"),
  });
}
