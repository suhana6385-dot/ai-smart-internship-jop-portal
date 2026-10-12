import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Flag, GraduationCap, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { AdminDataTable } from "@/components/tables/AdminDataTable";
import type { AdminSortableColumn } from "@/components/tables/AdminDataTable";
import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/ui/Button";
import { useAdminInternshipsQuery } from "@/hooks/useAdminQueries";
import { useUpdateInternshipStatusMutation } from "@/hooks/useAdminMutations";
import type { AdminInternshipRecord, ListingStatus } from "@/types/admin";

const statusStyles: Record<ListingStatus, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Closed: "bg-muted text-muted-foreground",
  Flagged: "bg-red-500/10 text-red-600 dark:text-red-400",
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function Internships() {
  const { data: internships, isLoading } = useAdminInternshipsQuery();
  const updateStatusMutation = useUpdateInternshipStatusMutation();
  const [removeTarget, setRemoveTarget] = useState<AdminInternshipRecord | null>(null);

  const columns: AdminSortableColumn<AdminInternshipRecord>[] = [
    { key: "title", header: "Internship", sortable: true },
    { key: "company", header: "Company", sortable: true },
    { key: "duration", header: "Duration" },
    { key: "stipend", header: "Stipend" },
    { key: "applicants", header: "Applicants", sortable: true },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[row.status]}`}>
          {row.status}
        </span>
      ),
    },
    { key: "postedOn", header: "Posted", sortable: true },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.status !== "Active" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-emerald-500 hover:text-emerald-500"
              aria-label="Approve internship listing"
              onClick={() => updateStatusMutation.mutate({ id: row.id, status: "Active" })}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </Button>
          )}
          {row.status !== "Flagged" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-amber-500 hover:text-amber-500"
              aria-label="Flag internship listing"
              onClick={() => updateStatusMutation.mutate({ id: row.id, status: "Flagged" })}
            >
              <Flag className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            aria-label="Remove internship listing"
            onClick={() => setRemoveTarget(row)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Internship Management</h1>
        <p className="text-sm text-muted-foreground">
          Moderate internship listings, resolve flags, and manage availability.
        </p>
      </motion.div>

      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <GraduationCap className="h-4 w-4 text-primary" />
          <CardTitle>All Internship Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            columns={columns}
            data={internships ?? []}
            isLoading={isLoading}
            searchKeys={["title", "company"]}
            searchPlaceholder="Search by title or company..."
            filters={[
              {
                key: "status",
                label: "Statuses",
                options: [
                  { label: "Active", value: "Active" },
                  { label: "Closed", value: "Closed" },
                  { label: "Flagged", value: "Flagged" },
                  { label: "Pending", value: "Pending" },
                ],
              },
            ]}
            getRowKey={(row) => row.id}
            emptyTitle="No internship listings found"
            emptyDescription="Try a different search term or filter."
          />
        </CardContent>
      </Card>

      <Modal
        open={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        title="Remove this internship listing?"
        description={
          removeTarget
            ? `"${removeTarget.title}" at ${removeTarget.company} will be closed and hidden from students.`
            : undefined
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              isLoading={updateStatusMutation.isPending}
              onClick={() => {
                if (removeTarget) {
                  updateStatusMutation.mutate(
                    { id: removeTarget.id, status: "Closed" },
                    { onSuccess: () => setRemoveTarget(null) }
                  );
                }
              }}
            >
              Yes, remove
            </Button>
          </>
        }
      />
    </div>
  );
}

export default Internships;
