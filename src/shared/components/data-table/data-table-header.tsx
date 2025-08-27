import { flexRender } from '@tanstack/react-table';

import { TableHead, TableHeader, TableRow } from '@/shared/ui/table';

import { DataTableProps } from './types';

export function DataTableHeader<TData, TValue>({ table }: Omit<DataTableProps<TData, TValue>, 'columns'>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};