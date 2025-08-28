'use client';

import { ColumnDef, flexRender } from '@tanstack/react-table';

import { TableBody, TableCell, TableRow } from '@/shared/ui/table';

import { DataTableElementProps } from './types';
import { SkeletonTableLoader } from '../skeleton-table-loader-fallback';

interface DataTableBodyProps<TData, TValue> extends DataTableElementProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
}

export function DataTableBody<TData, TValue>({ table, columns, isLoading }: DataTableBodyProps<TData, TValue>) {
  if (isLoading) {
    return (
      <TableBody>
        <SkeletonTableLoader
          count={1}
          as={TableRow}
          skeletonClassName='w-full h-8'
        />
      </TableBody>
    )
  }

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}