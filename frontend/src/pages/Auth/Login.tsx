import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/forms/FormInput";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { FormCheckbox } from "@/components/forms/FormCheckbox";
import { useLoginMutation } from "@/hooks/useAuthMutations";
import { loginSchema } from "@/validations/authValidation";
import type { LoginFormValues } from "@/validations/authValidation";

interface LocationState {
  from?: { pathname: string };
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(
      { email: values.email, password: values.password, rememberMe: values.rememberMe },
      {
        onSuccess: () => {
          const state = location.state as LocationState | null;
          const redirectTo = state?.from?.pathname ?? "/dashboard";
          navigate(redirectTo, { replace: true });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LogIn className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Log in to continue to your dashboard.
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

        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <FormCheckbox label="Remember me" {...register("rememberMe")} />
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={loginMutation.isPending}
        >
          Log in
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;
