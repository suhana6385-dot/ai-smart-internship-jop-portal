import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  changePassword,
  generateCoverLetter,
  markNotificationRead,
  saveOpportunity,
  submitMockInterview,
  updateNotificationPreferences,
  updateStudentProfile,
  uploadResume,
} from "@/services/studentService";
import { useAppDispatch } from "@/redux/hooks";
import { setStudentProfile, setStudentResume } from "@/redux/slices/studentSlice";

export function useUpdateProfileMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentProfile,
    onSuccess: (data) => {
      dispatch(setStudentProfile(data));
      queryClient.setQueryData(["student", "profile"], data);
      toast.success("Profile updated successfully");
    },
    onError: () => toast.error("Couldn't update your profile. Please try again."),
  });
}

export function useUploadResumeMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadResume,
    onSuccess: (data) => {
      dispatch(setStudentResume(data));
      queryClient.setQueryData(["student", "resume"], data);
      queryClient.invalidateQueries({ queryKey: ["student", "ats-score"] });
      toast.success("Resume uploaded and analyzed");
    },
    onError: () => toast.error("Resume upload failed. Please try again."),
  });
}

export function useSaveOpportunityMutation() {
  return useMutation({
    mutationFn: saveOpportunity,
    onSuccess: () => toast.success("Saved to your list"),
    onError: () => toast.error("Couldn't save this opportunity right now."),
  });
}

export function useGenerateCoverLetterMutation() {
  return useMutation({
    mutationFn: generateCoverLetter,
    onSuccess: () => toast.success("Cover letter generated"),
    onError: () => toast.error("Couldn't generate the cover letter. Please try again."),
  });
}

export function useSubmitMockInterviewMutation() {
  return useMutation({
    mutationFn: ({
      type,
      answers,
    }: {
      type: Parameters<typeof submitMockInterview>[0];
      answers: Record<string, string>;
    }) => submitMockInterview(type, answers),
    onSuccess: () => toast.success("Interview submitted — feedback is ready"),
    onError: () => toast.error("Couldn't score your interview. Please try again."),
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "notifications"] });
    },
  });
}

export function useUpdateNotificationPreferencesMutation() {
  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => toast.success("Notification preferences saved"),
    onError: () => toast.error("Couldn't save your preferences."),
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => toast.success(data.message),
    onError: () => toast.error("Couldn't change your password. Please try again."),
  });
}
