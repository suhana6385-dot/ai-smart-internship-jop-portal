import { motion } from "framer-motion";
import { BadgeCheck, Clock, IndianRupee } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { InlineLoader } from "@/components/loaders/Loader";
import { Button } from "@/components/ui/Button";
import { useCertificationRecommendationsQuery } from "@/hooks/useStudentQueries";
import type { CertificationRecommendationItem } from "@/types/student";

const priorityStyles: Record<CertificationRecommendationItem["priority"], string> = {
  High: "bg-red-500/10 text-red-600 dark:text-red-400",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export function CertificationRecommendation() {
  const { data: certifications, isLoading } = useCertificationRecommendationsQuery();

  if (isLoading) {
    return <InlineLoader label="Finding certifications that boost your profile..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Certification Recommendation</h1>
        <p className="text-sm text-muted-foreground">
          Industry-recognized certifications ranked by priority for your career goal.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {certifications?.map((cert, index) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
          >
            <Card className="flex h-full flex-col p-5">
              <CardHeader className="p-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityStyles[cert.priority]}`}
                  >
                    {cert.priority} priority
                  </span>
                </div>
                <CardTitle className="mt-2 text-base leading-snug">{cert.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4 p-0 pt-3">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{cert.provider}</p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {cert.duration}
                  </p>
                  <p className="flex items-center gap-1">
                    <IndianRupee className="h-3.5 w-3.5" /> {cert.cost}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
                    {cert.skillCovered}
                  </span>
                  <Button size="sm" variant="outline">
                    View details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default CertificationRecommendation;
