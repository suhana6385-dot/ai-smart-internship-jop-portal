import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { DataTable } from "@/components/tables/Table";
import { Button } from "@/components/ui/Button";
import { InlineLoader } from "@/components/loaders/Loader";
import { useLearningRecommendationsQuery, useSkillGapQuery } from "@/hooks/useStudentQueries";
import type { SkillGapItem } from "@/types/student";
import type { TableColumn } from "@/types";

const demandStyles: Record<SkillGapItem["demandLevel"], string> = {
  High: "bg-red-500/10 text-red-600 dark:text-red-400",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

const columns: TableColumn<SkillGapItem>[] = [
  { key: "skill", header: "Skill" },
  {
    key: "demandLevel",
    header: "Demand",
    render: (row) => (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${demandStyles[row.demandLevel]}`}>
        {row.demandLevel}
      </span>
    ),
  },
  {
    key: "currentLevel",
    header: "Your Level",
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${row.currentLevel}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">{row.currentLevel}%</span>
      </div>
    ),
  },
  { key: "requiredLevel", header: "Required Level", render: (row) => `${row.requiredLevel}%` },
];

export function SkillGap() {
  const { data: gaps, isLoading } = useSkillGapQuery();
  const { data: recommendations } = useLearningRecommendationsQuery();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Skill Gap Analysis</h1>
        <p className="text-sm text-muted-foreground">
          Identify what's missing between your current skillset and market demand.
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Missing Skills & Demand</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <InlineLoader />
          ) : (
            <DataTable columns={columns} data={gaps ?? []} getRowKey={(row) => row.skill} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations?.map((rec) => (
            <div key={rec.title} className="flex flex-col justify-between rounded-md border border-border p-4">
              <div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {rec.skill}
                </span>
                <p className="mt-2 font-medium text-foreground">{rec.title}</p>
                <p className="text-xs text-muted-foreground">
                  {rec.provider} · {rec.duration}
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <a href={rec.url} target="_blank" rel="noreferrer">
                  View course <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default SkillGap;
