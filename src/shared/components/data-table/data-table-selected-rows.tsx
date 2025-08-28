'use client';

import { DataTableElementProps } from './types';

export function DataTableSelectedRows<TData, TValue>({ table }: DataTableElementProps<TData, TValue>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="text-muted-foreground flex-1 text-sm">
      {selectedRows} of{" "}
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
  );
};