import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  forgotPasswordRequest,
  loginRequest,
  registerRequest,
  resetPasswordRequest,
} from "@/services/authService";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/authSlice";
import type { AuthResponse, MessageResponse } from "@/types/auth";

/**
 * Pulls a human-readable message out of an Axios error, falling back
 * to a generic string if the backend didn't send one. Centralized here
 * so every auth mutation reports errors the same way.
 */
function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  return fallback;
}

export function useLoginMutation() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data: AuthResponse) => {
      dispatch(setCredentials(data));
      toast.success("Welcome back!", {
        description: `Signed in as ${data.user.name}`,
      });
    },
    onError: (error) => {
      toast.error("Login failed", {
        description: extractErrorMessage(error, "Check your credentials and try again."),
      });
    },
  });
}

export function useRegisterMutation() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: registerRequest,
    onSuccess: (data: AuthResponse) => {
      dispatch(setCredentials(data));
      toast.success("Account created", {
        description: `Welcome aboard, ${data.user.name}!`,
      });
    },
    onError: (error) => {
      toast.error("Registration failed", {
        description: extractErrorMessage(error, "Please check your details and try again."),
      });
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: (data: MessageResponse) => {
      toast.success("Check your inbox", {
        description: data.message || "If that email exists, a reset link is on its way.",
      });
    },
    onError: (error) => {
      toast.error("Something went wrong", {
        description: extractErrorMessage(error, "Please try again in a moment."),
      });
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: (data: MessageResponse) => {
      toast.success("Password updated", {
        description: data.message || "You can now sign in with your new password.",
      });
    },
    onError: (error) => {
      toast.error("Reset failed", {
        description: extractErrorMessage(error, "This link may have expired. Try again."),
      });
    },
  });
}
