"use client";

import * as React from "react"

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

import { DataTableHeader } from './data-table-header';
import { DataTableBody } from './data-table-body';
import { DataTablePagination } from './data-table-pagination';
import { DataTableFiltering } from './types';
import { DataTableFilter } from './data-table-filter';
import { DataTableDeleteButton } from './data-table-delete-button';
import { DataTableSelectedRows } from './data-table-selected-rows';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filter?: DataTableFiltering;
  onDelete?: (rows: Row<TData>[]) => void;
  disabled?: boolean;
}

export function DataTable<TData, TValue>({ columns, data, filter, onDelete, disabled }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({})

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
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <DataTableFilter table={table} filter={filter} />
        <DataTableDeleteButton table={table} disabled={disabled} onDelete={onDelete} />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTableSelectedRows table={table} />
        <DataTablePagination table={table} />
      </div>
    </div>
  );
};