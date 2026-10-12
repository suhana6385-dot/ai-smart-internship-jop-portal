import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Briefcase, MapPin } from "lucide-react";
import { Card } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import type { OpportunityItem } from "@/types/student";

interface OpportunityCardProps {
  opportunity: OpportunityItem;
  onSave?: (id: string) => void;
  onApply?: (id: string) => void;
  isSaving?: boolean;
}

function matchColor(score: number) {
  if (score >= 75) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-muted-foreground";
}

export function OpportunityCard({
  opportunity,
  onSave,
  onApply,
  isSaving,
}: OpportunityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2 sm:items-center">
            <div>
              <h3 className="font-semibold text-card-foreground">{opportunity.title}</h3>
              <p className="text-sm text-muted-foreground">{opportunity.company}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold",
                matchColor(opportunity.matchScore)
              )}
            >
              {opportunity.matchScore}% match
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {opportunity.location} · {opportunity.type}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" /> {opportunity.stipendOrSalary}
            </span>
            <span>{opportunity.postedAgo}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {opportunity.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:flex-col">
          <Button size="sm" onClick={() => onApply?.(opportunity.id)} className="flex-1 sm:flex-none">
            Apply now
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSave?.(opportunity.id)}
            disabled={isSaving}
            className="flex-1 sm:flex-none"
          >
            {opportunity.saved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {opportunity.saved ? "Saved" : "Save"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
