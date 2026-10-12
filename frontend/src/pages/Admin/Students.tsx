import { useState } from "react";
import { motion } from "framer-motion";
import { Ban, CheckCircle2, Eye, Trash2, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { AdminDataTable } from "@/components/tables/AdminDataTable";
import type { AdminSortableColumn } from "@/components/tables/AdminDataTable";
import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/ui/Button";
import { useAdminStudentsQuery } from "@/hooks/useAdminQueries";
import { useDeleteStudentMutation, useUpdateStudentStatusMutation } from "@/hooks/useAdminMutations";
import type { AccountStatus, AdminStudentRecord } from "@/types/admin";

const statusStyles: Record<AccountStatus, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Suspended: "bg-red-500/10 text-red-600 dark:text-red-400",
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function Students() {
  const { data: students, isLoading } = useAdminStudentsQuery();
  const updateStatusMutation = useUpdateStudentStatusMutation();
  const deleteMutation = useDeleteStudentMutation();
  const [selected, setSelected] = useState<AdminStudentRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminStudentRecord | null>(null);

  const columns: AdminSortableColumn<AdminStudentRecord>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "institution", header: "Institution", sortable: true },
    {
      key: "profileCompletion",
      header: "Profile",
      sortable: true,
      render: (row) => `${row.profileCompletion}%`,
    },
    { key: "applicationsCount", header: "Applications", sortable: true },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[row.status]}`}>
          {row.status}
        </span>
      ),
    },
    { key: "joinedOn", header: "Joined", sortable: true },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="View student details"
            onClick={() => setSelected(row)}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={row.status === "Active" ? "Suspend student" : "Activate student"}
            onClick={() =>
              updateStatusMutation.mutate({
                id: row.id,
                status: row.status === "Active" ? "Suspended" : "Active",
              })
            }
          >
            {row.status === "Active" ? (
              <Ban className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            aria-label="Delete student"
            onClick={() => setDeleteTarget(row)}
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
        <h1 className="text-2xl font-semibold text-foreground">Student Management</h1>
        <p className="text-sm text-muted-foreground">
          View, verify, and moderate student accounts across the platform.
        </p>
      </motion.div>

      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <Users className="h-4 w-4 text-primary" />
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            columns={columns}
            data={students ?? []}
            isLoading={isLoading}
            searchKeys={["name", "email", "institution"]}
            searchPlaceholder="Search by name, email, institution..."
            filters={[
              {
                key: "status",
                label: "Statuses",
                options: [
                  { label: "Active", value: "Active" },
                  { label: "Suspended", value: "Suspended" },
                  { label: "Pending", value: "Pending" },
                ],
              },
            ]}
            getRowKey={(row) => row.id}
            emptyTitle="No students found"
            emptyDescription="Try a different search term or filter."
          />
        </CardContent>
      </Card>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name}
        description={selected?.email}
      >
        {selected && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Institution:</span> {selected.institution}
            </p>
            <p>
              <span className="text-muted-foreground">Profile completion:</span>{" "}
              {selected.profileCompletion}%
            </p>
            <p>
              <span className="text-muted-foreground">Applications submitted:</span>{" "}
              {selected.applicationsCount}
            </p>
            <p>
              <span className="text-muted-foreground">Joined on:</span> {selected.joinedOn}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Remove this student?"
        description={deleteTarget ? `${deleteTarget.name} will be permanently removed.` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              isLoading={deleteMutation.isPending}
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate(deleteTarget.id, {
                    onSuccess: () => setDeleteTarget(null),
                  });
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

export default Students;
