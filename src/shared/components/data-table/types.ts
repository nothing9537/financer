import { ColumnDef, Table } from '@tanstack/react-table';

export interface DataTableProps<TData, TValue> {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
}

export interface DataTableFiltering {
  key: string;
  placeholder?: string;
}