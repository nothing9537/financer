"use client";

import * as React from "react";

import {
  Row,
  ColumnDef,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Table } from "@/shared/ui/table";

import { DataTableDeleteButton } from './data-table-delete-button';
import { DataTableSelectedRows } from './data-table-selected-rows';
import { DataTablePagination } from './data-table-pagination';
import { DataTableHeader } from './data-table-header';
import { DataTableFilter } from './data-table-filter';
import { DataTableBody } from './data-table-body';
import { DataTableFiltering } from './types';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filter?: DataTableFiltering;
  onDelete?: (rows: Row<TData>[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({ columns, data, filter, disabled, onDelete, isLoading }: DataTableProps<TData, TValue>) {


  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, rowSelection },
  });

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <DataTableFilter table={table} filter={filter} />
        <DataTableDeleteButton table={table} disabled={disabled} onDelete={onDelete} />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          {!isLoading && <DataTableHeader table={table} />}
          <DataTableBody table={table} columns={columns} isLoading={isLoading} />
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {onDelete && <DataTableSelectedRows table={table} />}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
};