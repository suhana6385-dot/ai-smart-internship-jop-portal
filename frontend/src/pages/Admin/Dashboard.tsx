import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Bell,
  Settings as SettingsIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { StatCard, Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { DonutChart } from "@/components/charts/DonutChart";
import { InlineLoader } from "@/components/loaders/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  useAdminNotificationsQuery,
  useAdminOverviewQuery,
  useApplicationBreakdownQuery,
  usePendingVerificationsQuery,
  usePlatformSettingsQuery,
  useSignupTrendsQuery,
} from "@/hooks/useAdminQueries";
import {
  useMarkAdminNotificationReadMutation,
  useUpdatePlatformSettingsMutation,
} from "@/hooks/useAdminMutations";
import type { PlatformSettings } from "@/types/admin";

const verificationLinkByType: Record<string, string> = {
  Company: "/admin/companies",
  Job: "/admin/jobs",
  Internship: "/admin/internships",
};

export function Dashboard() {
  const { data: overview, isLoading: overviewLoading } = useAdminOverviewQuery();
  const { data: signupTrends } = useSignupTrendsQuery();
  const { data: applicationBreakdown } = useApplicationBreakdownQuery();
  const { data: pendingVerifications } = usePendingVerificationsQuery();
  const { data: notifications } = useAdminNotificationsQuery();
  const { data: settings } = usePlatformSettingsQuery();

  const markReadMutation = useMarkAdminNotificationReadMutation();
  const updateSettingsMutation = useUpdatePlatformSettingsMutation();
  const [localSettings, setLocalSettings] = useState<PlatformSettings | null>(null);

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const toggleSetting = (key: keyof PlatformSettings) => {
    if (!localSettings || typeof localSettings[key] !== "boolean") return;
    const next = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(next);
    updateSettingsMutation.mutate(next);
  };

  if (overviewLoading || !overview) {
    return <InlineLoader label="Loading admin dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide overview of students, companies, jobs, and internships.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Students" value={overview.totalStudents.toLocaleString()} icon={Users} />
        <StatCard label="Companies" value={overview.totalCompanies.toLocaleString()} icon={Building2} />
        <StatCard label="Jobs" value={overview.totalJobs.toLocaleString()} icon={Briefcase} />
        <StatCard label="Internships" value={overview.totalInternships.toLocaleString()} icon={GraduationCap} />
        <StatCard label="Placement Rate" value={`${overview.placementRate}%`} icon={TrendingUp} />
        <StatCard label="Pending Verifications" value={overview.pendingVerifications} icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Signup Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={signupTrends ?? []} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={false}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="students" name="Students" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="companies" name="Companies" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={applicationBreakdown ?? []} nameKey="status" valueKey="count" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <CardTitle>Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {!pendingVerifications?.length ? (
              <EmptyState title="Nothing pending" description="All submissions have been reviewed." />
            ) : (
              pendingVerifications.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type} · Submitted {item.submittedOn}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to={verificationLinkByType[item.type] ?? "/admin/dashboard"}>Review</Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Bell className="h-4 w-4 text-primary" />
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {!notifications?.length ? (
              <EmptyState title="No notifications" description="You're all caught up." />
            ) : (
              notifications.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start justify-between gap-2 rounded-md border border-border px-3 py-2 ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                  </div>
                  {!n.read && (
                    <Button variant="ghost" size="sm" onClick={() => markReadMutation.mutate(n.id)}>
                      Mark read
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <SettingsIcon className="h-4 w-4 text-primary" />
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {!localSettings ? (
            <InlineLoader />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { key: "maintenanceMode" as const, label: "Maintenance mode" },
                { key: "autoVerifyCompanies" as const, label: "Auto-verify companies" },
                { key: "allowNewRegistrations" as const, label: "Allow new registrations" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                  <span className="text-sm text-foreground">{label}</span>
                  <button
                    role="switch"
                    aria-checked={localSettings[key]}
                    onClick={() => toggleSetting(key)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      localSettings[key] ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        localSettings[key] ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-md border border-border px-4 py-3 sm:col-span-2">
                <span className="text-sm text-foreground">Content moderation level</span>
                <span className="flex items-center gap-1 text-sm font-medium text-primary">
                  {localSettings.contentModerationLevel === "High" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  {localSettings.contentModerationLevel}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
