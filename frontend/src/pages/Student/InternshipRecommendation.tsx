import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { OpportunityCard } from "@/components/cards/OpportunityCard";
import { InlineLoader } from "@/components/loaders/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useInternshipRecommendationsQuery } from "@/hooks/useStudentQueries";
import { useSaveOpportunityMutation } from "@/hooks/useStudentMutations";

export function InternshipRecommendation() {
  const { data: internships, isLoading } = useInternshipRecommendationsQuery();
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
        <h1 className="text-2xl font-semibold text-foreground">Internship Recommendations</h1>
        <p className="text-sm text-muted-foreground">
          Personalized internships ranked by how well they match your profile.
        </p>
      </motion.div>

      {isLoading ? (
        <InlineLoader label="Finding internships for you..." />
      ) : !internships?.length ? (
        <EmptyState title="No internships found" description="Check back soon for new matches." />
      ) : (
        <div className="space-y-4">
          {internships.map((internship) => (
            <OpportunityCard
              key={internship.id}
              opportunity={{ ...internship, saved: savedIds.has(internship.id) }}
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

export default InternshipRecommendation;
