import { ColumnDef, flexRender } from '@tanstack/react-table';

import { TableBody, TableCell, TableRow } from '@/shared/ui/table';

import { DataTableProps } from './types';

interface DataTableBodyProps<TData, TValue> extends DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTableBody<TData, TValue>({ table, columns }: DataTableBodyProps<TData, TValue>) {
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