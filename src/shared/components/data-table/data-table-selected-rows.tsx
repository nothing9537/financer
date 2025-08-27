import { DataTableProps } from './types';

export function DataTableSelectedRows<TData, TValue>({ table }: Omit<DataTableProps<TData, TValue>, 'columns'>) {
  return (
    <div className="text-muted-foreground flex-1 text-sm">
      {table.getFilteredSelectedRowModel().rows.length} of{" "}
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
  );
};