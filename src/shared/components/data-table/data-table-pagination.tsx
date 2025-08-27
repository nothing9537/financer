import { Button } from '@/shared/ui/button';

import { DataTableProps } from './types';

export function DataTablePagination<TData, TValue>({ table }: Omit<DataTableProps<TData, TValue>, 'columns'>) {
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