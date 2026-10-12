import { motion } from "framer-motion";
import { HammerIcon } from "lucide-react";

interface ComingSoonProps {
  title: string;
}

/**
 * Temporary placeholder rendered by route entries whose real page
 * component hasn't been built yet (Auth / Student / Company / Admin
 * pages). Swap the route's `element` for the real page once it exists —
 * no other routing changes are required.
 */
export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <HammerIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          This page is on the roadmap and hasn't been built yet.
        </p>
      </motion.div>
    </div>
  );
}
