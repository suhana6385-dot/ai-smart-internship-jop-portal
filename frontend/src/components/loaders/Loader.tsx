import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export function Loader({ size = "md", className, label }: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}

/**
 * Full-viewport loader used as the React Router / Suspense fallback
 * while a route or lazily-loaded chunk is resolving.
 */
export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen w-full items-center justify-center bg-background"
    >
      <Loader size="lg" label={label} />
    </motion.div>
  );
}

/**
 * Small inline loader for buttons, cards, or table bodies.
 */
export function InlineLoader({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-10">
      <Loader size="md" label={label} />
    </div>
  );
}
