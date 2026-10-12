import { motion } from "framer-motion";
import { Compass, IndianRupee } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { InlineLoader } from "@/components/loaders/Loader";
import { useCareerPathsQuery } from "@/hooks/useStudentQueries";

export function CareerRecommendation() {
  const { data: careers, isLoading } = useCareerPathsQuery();

  if (isLoading) {
    return <InlineLoader label="Predicting your best-fit career paths..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Career Recommendation</h1>
        <p className="text-sm text-muted-foreground">
          AI-predicted career paths based on your skills, projects, and interests.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {careers?.map((career, index) => (
          <motion.div
            key={career.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="flex h-full flex-col">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Compass className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-primary">{career.confidence}% match</span>
                </div>
                <CardTitle className="text-lg">{career.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="text-sm text-muted-foreground">{career.description}</p>
                <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                  <IndianRupee className="h-3.5 w-3.5" /> {career.averageSalary}
                </p>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                    Career Roadmap
                  </p>
                  <ol className="space-y-2">
                    {career.roadmap.map((step, i) => (
                      <li key={step} className="flex gap-2 text-sm text-foreground">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default CareerRecommendation;
