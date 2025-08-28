'use client';

import { Trash } from 'lucide-react';
import { Row } from '@tanstack/react-table';

import { useConfirm } from '@/shared/lib/hooks/use-confirm';
import { Button } from '@/shared/ui/button';

import { DataTableElementProps } from './types';

type DataTableDeleteButtonProps<TData, TValue> = DataTableElementProps<TData, TValue> & {
  disabled?: boolean;
  onDelete?: (rows: Row<TData>[]) => void;
};

export function DataTableDeleteButton<TData, TValue>({ table, onDelete }: DataTableDeleteButtonProps<TData, TValue>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;
  const [ConfirmDialog, confirm] = useConfirm({ title: "Are you sure?", description: "You are about to perform a bulk delete." });


  const deleteHandler = async () => {
    const ok = await confirm();

    if (ok) {
      onDelete?.(table.getFilteredSelectedRowModel().rows);
      table.resetRowSelection();
    }
  };

  if (selectedRows > 0) {
    return (
      <>
        <ConfirmDialog />
        <Button size="sm" variant="outline" className='ml-auto font-normal text-xs' onClick={deleteHandler}>
          <Trash className='size-4 mr-1' />
          Delete ({selectedRows})
        </Button>
      </>
    )
  }

  return null;
}