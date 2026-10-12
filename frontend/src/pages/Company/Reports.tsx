import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Briefcase,
  GraduationCap,
  FileText,
  CalendarClock,
  Award,
  TrendingUp,
  FileDown,
  Sheet,
  Download,
  Inbox,
  Star,
  UserCheck,
} from "lucide-react";

interface StatCard {
  icon: typeof Briefcase;
  label: string;
  value: string;
  color: string;
}

interface HiringTrendPoint {
  month: string;
  hires: number;
  applications: number;
}

interface JobApplicationData {
  title: string;
  applications: number;
}

interface TopListing {
  title: string;
  applications: number;
  hires: number;
  successRate: number;
}

interface RecentActivity {
  id: string;
  candidateName: string;
  position: string;
  action: string;
  date: string;
}

const statCards: StatCard[] = [
  {
    icon: Briefcase,
    label: "Total Jobs Posted",
    value: "42",
    color: "indigo",
  },
  {
    icon: GraduationCap,
    label: "Total Internships Posted",
    value: "58",
    color: "violet",
  },
  {
    icon: FileText,
    label: "Total Applications",
    value: "1,284",
    color: "purple",
  },
  {
    icon: CalendarClock,
    label: "Total Interviews",
    value: "196",
    color: "amber",
  },
  {
    icon: Award,
    label: "Total Hires",
    value: "56",
    color: "emerald",
  },
  {
    icon: TrendingUp,
    label: "Hiring Success Rate",
    value: "28.6%",
    color: "rose",
  },
];

const hiringTrendData: HiringTrendPoint[] = [
  { month: "Feb", hires: 5, applications: 140 },
  { month: "Mar", hires: 7, applications: 165 },
  { month: "Apr", hires: 6, applications: 158 },
  { month: "May", hires: 9, applications: 190 },
  { month: "Jun", hires: 11, applications: 210 },
  { month: "Jul", hires: 18, applications: 221 },
];

const jobApplicationData: JobApplicationData[] = [
  { title: "Backend Developer", applications: 210 },
  { title: "Frontend Developer", applications: 185 },
  { title: "Product Manager", applications: 96 },
  { title: "QA Engineer", applications: 74 },
  { title: "DevOps Engineer", applications: 62 },
];

const internshipApplicationData: JobApplicationData[] = [
  { title: "Frontend Dev Intern", applications: 240 },
  { title: "Data Analyst Intern", applications: 198 },
  { title: "UI/UX Design Intern", applications: 152 },
  { title: "Product Mgmt Intern", applications: 110 },
  { title: "Marketing Intern", applications: 88 },
];

const topJobListings: TopListing[] = [
  { title: "Backend Developer", applications: 210, hires: 14, successRate: 6.7 },
  { title: "Frontend Developer", applications: 185, hires: 11, successRate: 5.9 },
  { title: "Product Manager", applications: 96, hires: 6, successRate: 6.3 },
];

const topInternshipListings: TopListing[] = [
  {
    title: "Frontend Dev Intern",
    applications: 240,
    hires: 16,
    successRate: 6.7,
  },
  {
    title: "Data Analyst Intern",
    applications: 198,
    hires: 12,
    successRate: 6.1,
  },
  {
    title: "UI/UX Design Intern",
    applications: 152,
    hires: 9,
    successRate: 5.9,
  },
];

const recentActivity: RecentActivity[] = [
  {
    id: "ACT-501",
    candidateName: "Karthik Reddy",
    position: "UI/UX Design Intern",
    action: "Hired",
    date: "Jul 16, 2026",
  },
  {
    id: "ACT-500",
    candidateName: "Tanvi Rao",
    position: "Data Analyst Intern",
    action: "Hired",
    date: "Jul 15, 2026",
  },
  {
    id: "ACT-499",
    candidateName: "Vikram Singh",
    position: "Backend Developer",
    action: "Interview Scheduled",
    date: "Jul 14, 2026",
  },
  {
    id: "ACT-498",
    candidateName: "Ananya Sharma",
    position: "Frontend Developer Intern",
    action: "Shortlisted",
    date: "Jul 13, 2026",
  },
  {
    id: "ACT-497",
    candidateName: "Rohan Gupta",
    position: "Product Management Intern",
    action: "Application Received",
    date: "Jul 12, 2026",
  },
];

const colorStyles: Record<string, string> = {
  indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
};

const actionStyles: Record<string, string> = {
  Hired:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  "Interview Scheduled":
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  Shortlisted:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  "Application Received":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
};

const dateRangeOptions = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
  { label: "This Year", value: "1y" },
];

export default function CompanyReports() {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("6m");
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, [dateRange]);

  return (
    <div className="w-full flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
            <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Company Reports
            </h1>
            <p className="text-sm text-muted-foreground">
              Track hiring performance and application trends over time.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl">
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="rounded-xl">
            <Sheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button className="rounded-xl font-semibold">
            <Download className="mr-2 h-4 w-4" />
            Download Analytics
          </Button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : !hasData ? (
        <Card className="rounded-2xl border-border/60">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No report data available
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              There is no hiring activity for the selected date range yet.
            </p>
            <Button
              variant="outline"
              className="rounded-xl mt-1"
              onClick={() => setHasData(true)}
            >
              Reset Date Range
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <Card className="rounded-2xl border-border/60 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-5 flex flex-col gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorStyles[stat.color]}`}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Monthly Hiring Trend
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Applications received versus candidates hired each month.
                  </p>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hiringTrendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis
                        dataKey="month"
                        stroke="currentColor"
                        className="text-xs text-muted-foreground"
                      />
                      <YAxis
                        stroke="currentColor"
                        className="text-xs text-muted-foreground"
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "0.75rem",
                          border: "1px solid hsl(var(--border))",
                          backgroundColor: "hsl(var(--card))",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="applications"
                        name="Applications"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="hires"
                        name="Hires"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="rounded-2xl border-border/60 h-full">
                <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Applications by Job
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Top full-time and part-time roles by application volume.
                    </p>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={jobApplicationData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          type="number"
                          stroke="currentColor"
                          className="text-xs text-muted-foreground"
                        />
                        <YAxis
                          type="category"
                          dataKey="title"
                          width={140}
                          stroke="currentColor"
                          className="text-xs text-muted-foreground"
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "0.75rem",
                            border: "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--card))",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Bar
                          dataKey="applications"
                          name="Applications"
                          fill="#6366f1"
                          radius={[0, 6, 6, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <Card className="rounded-2xl border-border/60 h-full">
                <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Applications by Internship
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Top internship programs by application volume.
                    </p>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={internshipApplicationData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          type="number"
                          stroke="currentColor"
                          className="text-xs text-muted-foreground"
                        />
                        <YAxis
                          type="category"
                          dataKey="title"
                          width={140}
                          stroke="currentColor"
                          className="text-xs text-muted-foreground"
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "0.75rem",
                            border: "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--card))",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Bar
                          dataKey="applications"
                          name="Applications"
                          fill="#a855f7"
                          radius={[0, 6, 6, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="rounded-2xl border-border/60 h-full">
                <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <h2 className="text-lg font-semibold text-foreground">
                      Top Performing Job Listings
                    </h2>
                  </div>
                  <div className="flex flex-col divide-y divide-border/60">
                    {topJobListings.map((listing, index) => (
                      <div
                        key={listing.title}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-sm font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {listing.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {listing.applications} applications ·{" "}
                              {listing.hires} hires
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="rounded-full font-medium shrink-0"
                        >
                          {listing.successRate}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <Card className="rounded-2xl border-border/60 h-full">
                <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <h2 className="text-lg font-semibold text-foreground">
                      Top Performing Internship Listings
                    </h2>
                  </div>
                  <div className="flex flex-col divide-y divide-border/60">
                    {topInternshipListings.map((listing, index) => (
                      <div
                        key={listing.title}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40 text-sm font-semibold text-violet-600 dark:text-violet-400 shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {listing.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {listing.applications} applications ·{" "}
                              {listing.hires} hires
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="rounded-full font-medium shrink-0"
                        >
                          {listing.successRate}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="rounded-2xl border-border/60">
              <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Recent Hiring Activity
                  </h2>
                </div>
                <div className="flex flex-col divide-y divide-border/60">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {activity.candidateName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.position}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={`rounded-full font-medium ${actionStyles[activity.action] ?? ""}`}
                        >
                          {activity.action}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {activity.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
