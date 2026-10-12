import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { KeyRound, MailCheck, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/forms/FormInput";
import { useForgotPasswordMutation } from "@/hooks/useAuthMutations";
import { forgotPasswordSchema } from "@/validations/authValidation";
import type { ForgotPasswordFormValues } from "@/validations/authValidation";

export function ForgotPassword() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const forgotPasswordMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(values, {
      onSuccess: () => setSubmittedEmail(values.email),
    });
  };

  if (submittedEmail) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 text-center"
      >
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{submittedEmail}</span>,
            we've sent a link to reset your password.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link to="/login">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRound className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormInput
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={forgotPasswordMutation.isPending}
        >
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
