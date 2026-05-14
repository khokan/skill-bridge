"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DynamicTableColumn<T> = {
  key: string;
  header: ReactNode;
  cell: (item: T) => ReactNode;
  className?: string;
};

export type DynamicTableFilter<T> = {
  id: string;
  label: string;
  options: Array<{ label: string; value: string }>;
  match: (item: T, value: string) => boolean;
  defaultValue?: string;
};

type DynamicTableProps<T> = {
  title: string;
  description?: string;
  items: T[];
  rowKey: (item: T) => string;
  columns: Array<DynamicTableColumn<T>>;
  searchPlaceholder?: string;
  searchMatch?: (item: T, query: string) => boolean;
  filters?: Array<DynamicTableFilter<T>>;
  emptyTitle?: string;
  emptyDescription?: string;
  actions?: ReactNode;
  initialPageSize?: number;
  pageSizeOptions?: number[];
};

export function DynamicTable<T>({
  title,
  description,
  items,
  rowKey,
  columns,
  searchPlaceholder = "Search records...",
  searchMatch,
  filters = [],
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your filters or search query.",
  actions,
  initialPageSize = 8,
  pageSizeOptions = [5, 8, 12, 20],
}: DynamicTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((filter) => [filter.id, filter.defaultValue ?? "ALL"]))
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !normalizedQuery ||
        (searchMatch
          ? searchMatch(item, normalizedQuery)
          : JSON.stringify(item).toLowerCase().includes(normalizedQuery));

      if (!matchesSearch) {
        return false;
      }

      return filters.every((filter) => {
        const value = filterValues[filter.id] ?? filter.defaultValue ?? "ALL";
        return value === "ALL" ? true : filter.match(item, value);
      });
    });
  }, [filterValues, filters, items, query, searchMatch]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedItems = filteredItems.slice((safePage - 1) * pageSize, safePage * pageSize);
  const hasActiveFilters =
    query.trim().length > 0 ||
    filters.some((filter) => (filterValues[filter.id] ?? filter.defaultValue ?? "ALL") !== "ALL");

  const clearFilters = () => {
    setQuery("");
    setPage(1);
    setPageSize(initialPageSize);

    const resetValues: Record<string, string> = {};
    for (const filter of filters) {
      resetValues[filter.id] = filter.defaultValue ?? "ALL";
    }

    setFilterValues(resetValues);
  };

  const start = filteredItems.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, filteredItems.length);

  return (
    <Card className="border-border/60 bg-card/95 shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>

          {filters.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <div key={filter.id} className="min-w-45 flex-1 lg:flex-none">
                  <Select
                    value={filterValues[filter.id] ?? filter.defaultValue ?? "ALL"}
                    onValueChange={(value) => {
                      setFilterValues((current) => ({ ...current, [filter.id]: value }));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters ? (
              <Button variant="ghost" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear
              </Button>
            ) : null}
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="flex flex-wrap gap-2">
            {query.trim() ? <Badge variant="secondary">Search: {query.trim()}</Badge> : null}
            {filters.map((filter) => {
              const value = filterValues[filter.id] ?? filter.defaultValue ?? "ALL";
              if (value === "ALL") return null;

              const label = filter.options.find((option) => option.value === value)?.label ?? value;
              return (
                <Badge key={filter.id} variant="secondary">
                  {filter.label}: {label}
                </Badge>
              );
            })}
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <TableRow key={rowKey(item)}>
                    {columns.map((column) => (
                      <TableCell key={column.key} className={cn(column.className)}>
                        {column.cell(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-16 text-center">
                    <div className="mx-auto max-w-sm space-y-2">
                      <p className="text-lg font-semibold">{emptyTitle}</p>
                      <p className="text-sm text-muted-foreground">{emptyDescription}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {start}-{end} of {filteredItems.length} record{filteredItems.length === 1 ? "" : "s"}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={safePage <= 1}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>
            <div className="min-w-24 text-center text-sm font-medium">
              Page {safePage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={safePage >= totalPages}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
