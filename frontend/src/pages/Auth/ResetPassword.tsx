import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { useResetPasswordMutation } from "@/hooks/useAuthMutations";
import { resetPasswordSchema } from "@/validations/authValidation";
import type { ResetPasswordFormValues } from "@/validations/authValidation";

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const resetPasswordMutation = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  if (!token || !email) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground">Invalid reset link</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is missing or invalid. Request a new one to
            continue.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link to="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(
      { token, email, password: values.password },
      {
        onSuccess: () => navigate("/login", { replace: true }),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Set a new password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a strong password for <span className="font-medium text-foreground">{email}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          placeholder="••••••••"
          hint="At least 8 characters, with upper, lower and a number."
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={resetPasswordMutation.isPending}
        >
          Reset password
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}

export default ResetPassword;
