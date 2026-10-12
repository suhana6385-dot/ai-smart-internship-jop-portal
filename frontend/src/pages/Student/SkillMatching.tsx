import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { SkillBarChart } from "@/components/charts/SkillBarChart";
import { InlineLoader } from "@/components/loaders/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSkillMatchesQuery } from "@/hooks/useStudentQueries";

export function SkillMatching() {
  const { data: matches, isLoading } = useSkillMatchesQuery();

  if (isLoading) {
    return <InlineLoader label="Matching your skills against job requirements..." />;
  }

  if (!matches?.length) {
    return (
      <EmptyState
        title="No skill matches yet"
        description="Upload your resume to see how your skills stack up against jobs."
      />
    );
  }

  const chartData = matches.map((m) => ({ name: `${m.jobTitle}`, value: m.matchPercentage }));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">AI Skill Matching</h1>
        <p className="text-sm text-muted-foreground">
          See how well your current skills match top job openings.
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Match Percentage by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillBarChart data={chartData} nameKey="name" valueKey="value" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {matches.map((match) => (
          <motion.div
            key={match.jobTitle}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-card-foreground">{match.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground">{match.company}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {match.matchPercentage}%
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Matched Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {match.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-600 dark:text-emerald-400"
                    >
                      <Check className="h-3 w-3" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Missing Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {match.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs text-red-600 dark:text-red-400"
                    >
                      <X className="h-3 w-3" /> {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default SkillMatching;
