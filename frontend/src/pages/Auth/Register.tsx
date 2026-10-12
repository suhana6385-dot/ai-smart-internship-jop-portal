import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/forms/FormInput";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormCheckbox } from "@/components/forms/FormCheckbox";
import { useRegisterMutation } from "@/hooks/useAuthMutations";
import { registerSchema } from "@/validations/authValidation";
import type { RegisterFormValues } from "@/validations/authValidation";

const ROLE_OPTIONS = [
  { label: "Student", value: "student" },
  { label: "Company", value: "company" },
];

export function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "student",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      },
      {
        onSuccess: () => navigate("/dashboard", { replace: true }),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserPlus className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Get matched with internships and jobs that fit you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormInput
          label="Full name"
          autoComplete="name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />

        <FormInput
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Account type"
              options={ROLE_OPTIONS}
              error={errors.role?.message}
              {...field}
            />
          )}
        />

        <PasswordInput
          label="Password"
          autoComplete="new-password"
          placeholder="••••••••"
          hint="At least 8 characters, with upper, lower and a number."
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <FormCheckbox
          label="I agree to the Terms of Service and Privacy Policy"
          error={errors.acceptTerms?.message}
          {...register("acceptTerms")}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={registerMutation.isPending}
        >
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default Register;
