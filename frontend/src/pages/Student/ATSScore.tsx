import { motion } from "framer-motion";
import { Check, X, Lightbulb } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { ScoreRadial } from "@/components/charts/ScoreRadial";
import { InlineLoader } from "@/components/loaders/Loader";
import { useATSScoreQuery } from "@/hooks/useStudentQueries";

const BREAKDOWN_LABELS = [
  { key: "formattingScore", label: "Formatting" },
  { key: "keywordScore", label: "Keyword Match" },
  { key: "readabilityScore", label: "Readability" },
] as const;

export function ATSScore() {
  const { data: result, isLoading } = useATSScoreQuery();

  if (isLoading || !result) {
    return <InlineLoader label="Calculating your ATS score..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">ATS Score & Resume Analysis</h1>
        <p className="text-sm text-muted-foreground">
          See how well your resume performs against Applicant Tracking Systems.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center py-8 lg:col-span-1">
          <ScoreRadial score={result.overallScore} label="Overall ATS Score" size={180} />
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {BREAKDOWN_LABELS.map(({ key, label }) => (
              <div key={key}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-foreground">{label}</span>
                  <span className="font-medium text-foreground">{result[key]}/100</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result[key]}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keyword Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.keywords.map((kw) => (
              <div
                key={kw.keyword}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
              >
                <span className="text-foreground">{kw.keyword}</span>
                {kw.found ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Lightbulb className="h-4 w-4 text-primary" />
            <CardTitle>Improvement Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ATSScore;
