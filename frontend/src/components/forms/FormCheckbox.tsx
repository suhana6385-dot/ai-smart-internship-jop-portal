import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

export interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="flex items-center gap-2 text-sm text-foreground">
          <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
            <input
              id={inputId}
              ref={ref}
              type="checkbox"
              className={cn(
                "peer h-4 w-4 shrink-0 appearance-none rounded-sm border border-input bg-background checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className
              )}
              {...props}
            />
            <Check className="pointer-events-none absolute h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100" />
          </span>
          {label}
        </label>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
FormCheckbox.displayName = "FormCheckbox";
