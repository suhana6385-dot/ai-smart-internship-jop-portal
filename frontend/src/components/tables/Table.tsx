import { cn } from "@/utils/cn";
import type { TableColumn } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineLoader } from "@/components/loaders/Loader";

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  getRowKey?: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
  emptyTitle = "No records found",
  emptyDescription = "There's nothing to show here yet.",
  getRowKey,
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return <InlineLoader label="Loading data..." />;
  }

  if (!data.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={cn("w-full overflow-x-auto rounded-lg border border-border", className)}>
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className={cn(
                  "whitespace-nowrap px-4 py-3 font-medium text-muted-foreground",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, index) => (
            <tr
              key={getRowKey ? getRowKey(row, index) : index}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "transition-colors",
                onRowClick && "cursor-pointer hover:bg-accent/50"
              )}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn("whitespace-nowrap px-4 py-3 text-foreground", col.className)}
                >
                  {col.render ? col.render(row) : String(row[col.key as keyof T] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
