'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { CellContext } from '@tanstack/react-table';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { useSheet } from '@/shared/lib/hooks/use-sheet';
import { useConfirm } from '@/shared/lib/hooks/use-confirm';
import { Transaction, useDeleteTransaction } from '@/entities/transactions';
import { Button } from '@/shared/ui/button';

export const TransactionsActionsCell = ({ row }: CellContext<Transaction, unknown>) => {
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    description: 'You are about to delete this transaction.'
  });
  const transactionDeleteMutation = useDeleteTransaction(row.original.id);
  const editTransactionSheet = useSheet<'edit-transaction'>();

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      transactionDeleteMutation.mutate();
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
          <DropdownMenuItem
            disabled={transactionDeleteMutation.isPending}
            onClick={() => editTransactionSheet.onOpen('edit-transaction', row.original)}
          >
            <Edit className='size-4 mr-2' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={transactionDeleteMutation.isPending} onClick={handleDelete} className='text-rose-500'>
            <Trash className='size-4 mr-2' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};