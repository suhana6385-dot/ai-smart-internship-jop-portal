import { motion } from "framer-motion";
import { Building2, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { TrendLine } from "@/components/charts/TrendLine";
import { SkillBarChart } from "@/components/charts/SkillBarChart";
import { InlineLoader } from "@/components/loaders/Loader";
import { useIndustryTrendsQuery } from "@/hooks/useStudentQueries";

export function IndustryTrend() {
  const { data: trends, isLoading } = useIndustryTrendsQuery();

  if (isLoading || !trends) {
    return <InlineLoader label="Crunching the latest industry data..." />;
  }

  const skillChartData = trends.trendingSkills.map((s) => ({ name: s.skill, value: s.growth }));
  const roleChartData = trends.inDemandRoles.map((r) => ({ name: r.role, value: r.demandScore }));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Industry Trend Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Stay ahead with trending skills, salary movement, and hiring activity.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <TrendingUp className="h-4 w-4 text-primary" />
            <CardTitle>Trending Skills (YoY growth %)</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillBarChart data={skillChartData} nameKey="name" valueKey="value" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Salary Trend (₹ LPA)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLine data={trends.salaryTrends} xKey="month" yKey="salary" valueSuffix=" LPA" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Building2 className="h-4 w-4 text-primary" />
            <CardTitle>Top Hiring Companies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {trends.hiringCompanies.map((company) => (
              <div
                key={company.company}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
              >
                <span className="text-foreground">{company.company}</span>
                <span className="font-medium text-primary">{company.openings} openings</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In-Demand Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillBarChart data={roleChartData} nameKey="name" valueKey="value" color="hsl(280 65% 60%)" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default IndustryTrend;
