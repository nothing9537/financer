'use client';

import { Button } from '@/shared/ui/button';

import { DataTableElementProps } from './types';

export function DataTablePagination<TData, TValue>({ table }: DataTableElementProps<TData, TValue>) {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </>

  )
}