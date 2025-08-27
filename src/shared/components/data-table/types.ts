import { Table } from '@tanstack/react-table';

export interface DataTableElementProps<TData, TValue> {
  table: Table<TData>;
}

export interface DataTableFiltering {
  key: string;
  placeholder?: string;
}