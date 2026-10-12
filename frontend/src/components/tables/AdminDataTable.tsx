import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { EmptyState } from "@/components/ui/EmptyState";
import { InlineLoader } from "@/components/loaders/Loader";
import type { TableColumn } from "@/types";

export interface AdminTableFilter {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

export interface AdminSortableColumn<T> extends TableColumn<T> {
  sortable?: boolean;
}

interface AdminDataTableProps<T extends Record<string, unknown>> {
  columns: AdminSortableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  filters?: AdminTableFilter[];
  pageSize?: number;
  getRowKey: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function AdminDataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
  searchKeys = [],
  searchPlaceholder = "Search...",
  filters = [],
  pageSize = 8,
  getRowKey,
  onRowClick,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search or filters.",
}: AdminDataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...data];

    if (search.trim() && searchKeys.length) {
      const term = search.trim().toLowerCase();
      result = result.filter((row) =>
        searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(term))
      );
    }

    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== "All") {
        result = result.filter((row) => String(row[key as keyof T]) === value);
      }
    });

    if (sort) {
      result.sort((a, b) => {
        const aVal = a[sort.key as keyof T];
        const bVal = b[sort.key as keyof T];
        const cmp =
          typeof aVal === "number" && typeof bVal === "number"
            ? aVal - bVal
            : String(aVal).localeCompare(String(bVal));
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [data, search, searchKeys, filterValues, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: string) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchKeys.length > 0 && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        )}

        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <select
                key={filter.key}
                value={filterValues[filter.key] ?? "All"}
                onChange={(e) => {
                  setFilterValues((prev) => ({ ...prev, [filter.key]: e.target.value }));
                  setPage(1);
                }}
                className="h-9 rounded-md border border-input bg-background px-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="All">All {filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <InlineLoader />
      ) : !filtered.length ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
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
                      {col.sortable ? (
                        <button
                          onClick={() => handleSort(String(col.key))}
                          className="flex items-center gap-1 hover:text-foreground"
                        >
                          {col.header}
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((row, index) => (
                  <tr
                    key={getRowKey(row, index)}
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

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-foreground">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
