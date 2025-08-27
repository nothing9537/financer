'use client';

import { flexRender } from '@tanstack/react-table';

import { TableHead, TableHeader, TableRow } from '@/shared/ui/table';

import { DataTableElementProps } from './types';

export function DataTableHeader<TData, TValue>({ table }: DataTableElementProps<TData, TValue>) {
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