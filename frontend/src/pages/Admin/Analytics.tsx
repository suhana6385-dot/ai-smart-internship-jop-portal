import { motion } from "framer-motion";
import { Activity, Gauge, TrendingUp, Users2, Zap } from "lucide-react";

import { StatCard, Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { ScoreRadial } from "@/components/charts/ScoreRadial";
import { SkillBarChart } from "@/components/charts/SkillBarChart";
import { TrendLine } from "@/components/charts/TrendLine";
import { InlineLoader } from "@/components/loaders/Loader";
import { useAnalyticsSummaryQuery } from "@/hooks/useAdminQueries";

export function Analytics() {
  const { data: analytics, isLoading } = useAnalyticsSummaryQuery();

  if (isLoading || !analytics) {
    return <InlineLoader label="Crunching platform analytics..." />;
  }

  const skillChartData = analytics.topSkills.map((s) => ({ name: s.skill, value: s.demand }));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide performance, hiring trends, and recommendation quality.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={analytics.totalStudents.toLocaleString()} icon={Users2} />
        <StatCard label="Total Companies" value={analytics.totalCompanies.toLocaleString()} icon={Users2} />
        <StatCard label="Placement Rate" value={`${analytics.placementRate}%`} icon={TrendingUp} />
        <StatCard
          label="Recommendation Accuracy"
          value={`${analytics.recommendationAccuracy}%`}
          icon={Gauge}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hiring Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLine data={analytics.hiringTrends} xKey="month" yKey="hires" valueSuffix=" hires" />
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center py-8">
          <ScoreRadial score={analytics.recommendationAccuracy} label="Recommendation Accuracy" size={170} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Skills in Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillBarChart data={skillChartData} nameKey="name" valueKey="value" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Applied Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.mostAppliedJobs.map((job) => (
              <div
                key={job.title}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium text-foreground">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                </div>
                <span className="font-medium text-primary">{job.applicants} applicants</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Activity className="h-4 w-4 text-primary" />
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-3.5 w-3.5" /> API Uptime
              </span>
              <span className="font-medium text-foreground">
                {analytics.platformPerformance.apiUptime}%
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span className="text-muted-foreground">Avg Response Time</span>
              <span className="font-medium text-foreground">
                {analytics.platformPerformance.avgResponseTimeMs} ms
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span className="text-muted-foreground">Error Rate</span>
              <span className="font-medium text-foreground">
                {analytics.platformPerformance.errorRate}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;
