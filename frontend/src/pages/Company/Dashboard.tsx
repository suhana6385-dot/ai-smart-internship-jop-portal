import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Briefcase,
  Users,
  CalendarCheck,
  Award,
  Plus,
  FileText,
  Eye,
  Inbox,
  TrendingUp,
  Building2,
} from "lucide-react";

interface DashboardStat {
  icon: typeof Briefcase;
  label: string;
  value: string;
  trend: string;
  color: string;
}

interface RecentApplicant {
  id: string;
  name: string;
  role: string;
  appliedFor: string;
  status: "New" | "Shortlisted" | "Interview" | "Rejected" | "Hired";
  appliedOn: string;
}

const dashboardStats: DashboardStat[] = [
  {
    icon: Briefcase,
    label: "Active Job Postings",
    value: "18",
    trend: "+3 this month",
    color: "indigo",
  },
  {
    icon: Users,
    label: "Total Applicants",
    value: "1,284",
    trend: "+142 this month",
    color: "violet",
  },
  {
    icon: CalendarCheck,
    label: "Interviews Scheduled",
    value: "27",
    trend: "8 this week",
    color: "purple",
  },
  {
    icon: Award,
    label: "Hires Made",
    value: "56",
    trend: "+6 this quarter",
    color: "emerald",
  },
];

const recentApplicants: RecentApplicant[] = [
  {
    id: "APP-1042",
    name: "Ananya Sharma",
    role: "Frontend Developer Intern",
    appliedFor: "Summer Internship 2026",
    status: "Interview",
    appliedOn: "Jul 15, 2026",
  },
  {
    id: "APP-1041",
    name: "Rahul Verma",
    role: "Data Analyst Intern",
    appliedFor: "AI Research Program",
    status: "Shortlisted",
    appliedOn: "Jul 15, 2026",
  },
  {
    id: "APP-1040",
    name: "Meera Iyer",
    role: "Backend Developer",
    appliedFor: "Full-Time Engineer",
    status: "New",
    appliedOn: "Jul 14, 2026",
  },
  {
    id: "APP-1039",
    name: "Karthik Reddy",
    role: "UI/UX Design Intern",
    appliedFor: "Design Internship",
    status: "Hired",
    appliedOn: "Jul 12, 2026",
  },
  {
    id: "APP-1038",
    name: "Sneha Kulkarni",
    role: "Product Management Intern",
    appliedFor: "Product Track 2026",
    status: "Rejected",
    appliedOn: "Jul 11, 2026",
  },
];

const statusStyles: Record<RecentApplicant["status"], string> = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Shortlisted:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Interview:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  Hired:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
};

const colorStyles: Record<string, string> = {
  indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
};

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [applicants, setApplicants] = useState<RecentApplicant[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setApplicants(recentApplicants);
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
            <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Company Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Track postings, applicants, and hiring performance in one place.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => navigate("/company/post-job")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Post a Job
          </Button>
          <Button
            className="rounded-xl font-semibold"
            onClick={() => navigate("/company/post-internship")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Post Internship
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Card className="rounded-2xl border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorStyles[stat.color]}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="rounded-2xl border-border/60">
          <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Applicants
                </h2>
                <p className="text-sm text-muted-foreground">
                  Latest candidates who applied to your postings.
                </p>
              </div>
              <Button
                variant="ghost"
                className="rounded-xl self-start sm:self-auto"
                onClick={() => navigate("/company/applicants")}
              >
                <Eye className="mr-2 h-4 w-4" />
                View All Applicants
              </Button>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : applicants.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  No applicants yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Once candidates start applying to your postings, they'll appear
                  here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border/60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Applied For
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Applied On
                      </TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {applicant.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {applicant.role}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {applicant.appliedFor}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            className={`rounded-full font-medium ${statusStyles[applicant.status]}`}
                            variant="outline"
                          >
                            {applicant.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {applicant.appliedOn}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            onClick={() =>
                              navigate(`/company/applicants/${applicant.id}`)
                            }
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
