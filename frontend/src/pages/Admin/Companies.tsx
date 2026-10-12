import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Check, Eye, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { AdminDataTable } from "@/components/tables/AdminDataTable";
import type { AdminSortableColumn } from "@/components/tables/AdminDataTable";
import { Modal } from "@/components/modals/Modal";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/Button";
import { useAdminCompaniesQuery } from "@/hooks/useAdminQueries";
import { useUpdateCompanyVerificationMutation } from "@/hooks/useAdminMutations";
import type { AdminCompanyRecord, VerificationStatus } from "@/types/admin";

const verificationStyles: Record<VerificationStatus, string> = {
  Verified: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export function Companies() {
  const { data: companies, isLoading } = useAdminCompaniesQuery();
  const verifyMutation = useUpdateCompanyVerificationMutation();
  const [selected, setSelected] = useState<AdminCompanyRecord | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminCompanyRecord | null>(null);
  const [reason, setReason] = useState("");

  const columns: AdminSortableColumn<AdminCompanyRecord>[] = [
    { key: "name", header: "Company", sortable: true },
    { key: "industry", header: "Industry", sortable: true },
    { key: "jobsPosted", header: "Jobs", sortable: true },
    { key: "internshipsPosted", header: "Internships", sortable: true },
    {
      key: "verification",
      header: "Verification",
      render: (row) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${verificationStyles[row.verification]}`}>
          {row.verification}
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
            aria-label="View company details"
            onClick={() => setSelected(row)}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          {row.verification !== "Verified" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-emerald-500 hover:text-emerald-500"
              aria-label="Verify company"
              onClick={() => verifyMutation.mutate({ id: row.id, verification: "Verified" })}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          )}
          {row.verification !== "Rejected" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              aria-label="Reject company"
              onClick={() => setRejectTarget(row)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Company Management</h1>
        <p className="text-sm text-muted-foreground">
          Review and verify companies before they can post jobs or internships.
        </p>
      </motion.div>

      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <Building2 className="h-4 w-4 text-primary" />
          <CardTitle>All Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            columns={columns}
            data={companies ?? []}
            isLoading={isLoading}
            searchKeys={["name", "industry"]}
            searchPlaceholder="Search by company or industry..."
            filters={[
              {
                key: "verification",
                label: "Verification",
                options: [
                  { label: "Verified", value: "Verified" },
                  { label: "Pending", value: "Pending" },
                  { label: "Rejected", value: "Rejected" },
                ],
              },
            ]}
            getRowKey={(row) => row.id}
            emptyTitle="No companies found"
            emptyDescription="Try a different search term or filter."
          />
        </CardContent>
      </Card>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name}
        description={selected?.industry}
      >
        {selected && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Jobs posted:</span> {selected.jobsPosted}
            </p>
            <p>
              <span className="text-muted-foreground">Internships posted:</span>{" "}
              {selected.internshipsPosted}
            </p>
            <p>
              <span className="text-muted-foreground">Verification:</span> {selected.verification}
            </p>
            <p>
              <span className="text-muted-foreground">Joined on:</span> {selected.joinedOn}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        title="Reject this company?"
        description={rejectTarget ? `Add a reason for rejecting ${rejectTarget.name}.` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              isLoading={verifyMutation.isPending}
              onClick={() => {
                if (rejectTarget) {
                  verifyMutation.mutate(
                    { id: rejectTarget.id, verification: "Rejected" },
                    { onSuccess: () => { setRejectTarget(null); setReason(""); } }
                  );
                }
              }}
            >
              Confirm rejection
            </Button>
          </>
        }
      >
        <FormTextarea
          label="Reason (optional)"
          placeholder="e.g. Incomplete registration documents..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default Companies;
