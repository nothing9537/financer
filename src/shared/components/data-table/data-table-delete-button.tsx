import { Button } from '@/shared/ui/button';

import { DataTableProps } from './types';
import { Trash } from 'lucide-react';
import { Row } from '@tanstack/react-table';

type DataTableDeleteButtonProps<TData, TValue> = Omit<DataTableProps<TData, TValue>, 'columns'> & {
  disabled?: boolean;
  onDelete?: (rows: Row<TData>[]) => void;
};

export function DataTableDeleteButton<TData, TValue>({ table }: DataTableDeleteButtonProps<TData, TValue>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;

  if (selectedRows > 0) {
    return (
      <Button size="sm" variant="outline" className='ml-auto font-normal text-xs'>
        <Trash className='size-4 mr-1' />
        Delete ({selectedRows})
      </Button>
    )
  }

  return null;
}