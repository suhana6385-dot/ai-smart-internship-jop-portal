import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { DataTable } from "@/components/tables/Table";
import { Modal } from "@/components/modals/Modal";
import { InlineLoader } from "@/components/loaders/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useApplicationsQuery } from "@/hooks/useStudentQueries";
import type { Application, ApplicationStatus } from "@/types/student";
import type { TableColumn } from "@/types";

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Interview: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Offer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const STATUS_FILTERS: ("All" | ApplicationStatus)[] = ["All", "Applied", "Interview", "Offer", "Rejected"];

export function ApplicationTracking() {
  const { data: applications, isLoading } = useApplicationsQuery();
  const [filter, setFilter] = useState<"All" | ApplicationStatus>("All");
  const [selected, setSelected] = useState<Application | null>(null);

  const filtered =
    filter === "All" ? applications ?? [] : (applications ?? []).filter((a) => a.status === filter);

  const columns: TableColumn<Application>[] = [
    { key: "jobTitle", header: "Job Title" },
    { key: "company", header: "Company" },
    { key: "appliedOn", header: "Applied On" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[row.status]}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Application Tracking</h1>
        <p className="text-sm text-muted-foreground">
          Track every job and internship application from applied to offer.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === s
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <InlineLoader />
          ) : !filtered.length ? (
            <EmptyState title="No applications found" description="Try a different filter, or apply to new roles." />
          ) : (
            <DataTable
              columns={columns}
              data={filtered}
              getRowKey={(row) => row.id}
              onRowClick={(row) => setSelected(row)}
            />
          )}
        </CardContent>
      </Card>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.jobTitle}
        description={selected?.company}
      >
        {selected && (
          <div className="space-y-3">
            {selected.timeline.map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CalendarClock className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{event.status}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ApplicationTracking;
