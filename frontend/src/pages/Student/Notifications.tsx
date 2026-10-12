import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Briefcase, FileText, GraduationCap, CalendarClock, CheckCheck } from "lucide-react";

import { Card, CardContent } from "@/components/cards/Card";
import { InlineLoader } from "@/components/loaders/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useNotificationsQuery } from "@/hooks/useStudentQueries";
import { useMarkNotificationReadMutation } from "@/hooks/useStudentMutations";
import type { NotificationType } from "@/types/student";
import { cn } from "@/utils/cn";

const TYPE_META: Record<NotificationType, { icon: typeof Bell; color: string }> = {
  Job: { icon: Briefcase, color: "text-blue-500" },
  Internship: { icon: GraduationCap, color: "text-purple-500" },
  Interview: { icon: CalendarClock, color: "text-amber-500" },
  Resume: { icon: FileText, color: "text-emerald-500" },
  Certification: { icon: CheckCheck, color: "text-pink-500" },
};

const FILTERS: ("All" | NotificationType)[] = [
  "All",
  "Job",
  "Internship",
  "Interview",
  "Resume",
  "Certification",
];

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function Notifications() {
  const { data: notifications, isLoading } = useNotificationsQuery();
  const markReadMutation = useMarkNotificationReadMutation();
  const [filter, setFilter] = useState<"All" | NotificationType>("All");

  const filtered =
    filter === "All" ? notifications ?? [] : (notifications ?? []).filter((n) => n.type === filter);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Job alerts, interview reminders, and resume/certification updates in one place.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="divide-y divide-border p-0">
          {isLoading ? (
            <InlineLoader />
          ) : !filtered.length ? (
            <EmptyState title="You're all caught up" description="No notifications in this category." />
          ) : (
            filtered.map((notification) => {
              const meta = TYPE_META[notification.type];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "flex items-start gap-3 p-4",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted", meta.color)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{notification.title}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markReadMutation.mutate(notification.id)}
                      className="shrink-0"
                    >
                      Mark read
                    </Button>
                  )}
                </motion.div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Notifications;
