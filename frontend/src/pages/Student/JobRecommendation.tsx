import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { OpportunityCard } from "@/components/cards/OpportunityCard";
import { InlineLoader } from "@/components/loaders/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useJobRecommendationsQuery } from "@/hooks/useStudentQueries";
import { useSaveOpportunityMutation } from "@/hooks/useStudentMutations";

export function JobRecommendation() {
  const { data: jobs, isLoading } = useJobRecommendationsQuery();
  const saveMutation = useSaveOpportunityMutation();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handleSave = (id: string) => {
    saveMutation.mutate(id, {
      onSuccess: () => setSavedIds((prev) => new Set(prev).add(id)),
    });
  };

  const handleApply = (id: string) => {
    toast.success("Application submitted", {
      description: "We've sent your profile to the recruiter.",
    });
    void id;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Job Recommendations</h1>
        <p className="text-sm text-muted-foreground">
          Full-time roles ranked by company match and skill fit.
        </p>
      </motion.div>

      {isLoading ? (
        <InlineLoader label="Finding jobs for you..." />
      ) : !jobs?.length ? (
        <EmptyState title="No jobs found" description="Check back soon for new matches." />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <OpportunityCard
              key={job.id}
              opportunity={{ ...job, saved: savedIds.has(job.id) }}
              onSave={handleSave}
              onApply={handleApply}
              isSaving={saveMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default JobRecommendation;
