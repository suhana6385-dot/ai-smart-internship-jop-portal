import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Bell,
  TrendingUp,
  ClipboardList,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

import { StatCard, Card, CardHeader, CardTitle, CardContent } from "@/components/cards/Card";
import { InlineLoader } from "@/components/loaders/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  useApplicationsQuery,
  useATSScoreQuery,
  useNotificationsQuery,
  useStudentProfileQuery,
} from "@/hooks/useStudentQueries";

const QUICK_LINKS = [
  { label: "Resume Analyzer", path: "/resume-analyzer", icon: FileText },
  { label: "Job Recommendations", path: "/job-recommendation", icon: Briefcase },
  { label: "Skill Gap Analysis", path: "/skill-gap", icon: TrendingUp },
  { label: "Mock Interview", path: "/mock-interview", icon: GraduationCap },
];

const statusStyles: Record<string, string> = {
  Applied: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Interview: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Offer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useStudentProfileQuery();
  const { data: atsResult } = useATSScoreQuery();
  const { data: applications, isLoading: applicationsLoading } = useApplicationsQuery();
  const { data: notifications } = useNotificationsQuery();

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  if (profileLoading) {
    return <InlineLoader label="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back, {profile?.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground">{profile?.headline}</p>
        </div>
        <Button asChild>
          <Link to="/profile">
            Complete your profile <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Profile Completion"
          value={`${profile?.profileCompletion ?? 0}%`}
          icon={GraduationCap}
        />
        <StatCard
          label="ATS Resume Score"
          value={atsResult?.overallScore ?? "—"}
          icon={FileText}
          trend={{ value: "4pts", direction: "up" }}
        />
        <StatCard
          label="Active Applications"
          value={applications?.length ?? 0}
          icon={ClipboardList}
        />
        <StatCard label="Unread Notifications" value={unreadCount} icon={Bell} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent Applications</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/application-tracking">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {applicationsLoading ? (
              <InlineLoader />
            ) : !applications?.length ? (
              <EmptyState title="No applications yet" description="Start applying to see them here." />
            ) : (
              applications.slice(0, 4).map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{app.jobTitle}</p>
                    <p className="text-xs text-muted-foreground">{app.company}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[app.status]}`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex flex-col items-center gap-2 rounded-md border border-border p-4 text-center transition-colors hover:bg-accent"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium text-foreground">{link.label}</span>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle>Tip of the day</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tailoring your resume keywords to each job description can raise your ATS score by up
            to 15 points. Head over to the ATS Score page to check yours.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
