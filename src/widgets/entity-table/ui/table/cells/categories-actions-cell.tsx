'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { CellContext } from '@tanstack/react-table';

import { Category, useDeleteCategory } from '@/entities/categories';
import { useConfirm } from '@/shared/lib/hooks/use-confirm';
import { useSheet } from '@/shared/lib/hooks/use-sheet';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';

export const CategoriesActionsCell = ({ row }: CellContext<Category, unknown>) => {
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    description: `You are about to delete this category.`
  });
  const accountDeleteMutation = useDeleteCategory(row.original.id);
  const openAccountSheet = useSheet<'edit-category'>();

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      accountDeleteMutation.mutate();
    }
  }

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className='size-8 p-0'>
            <MoreHorizontal className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={accountDeleteMutation.isPending} onClick={() => openAccountSheet.onOpen('edit-category', row.original)}>
            <Edit className='size-4 mr-2' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={accountDeleteMutation.isPending} onClick={handleDelete} className='text-rose-500'>
            <Trash className='size-4 mr-2' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};