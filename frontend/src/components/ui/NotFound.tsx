import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CompassIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <CompassIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          404
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </motion.div>
    </div>
  );
}
