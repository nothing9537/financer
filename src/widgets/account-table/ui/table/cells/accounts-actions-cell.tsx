'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { CellContext } from '@tanstack/react-table';

import { Account, useDeleteAccount } from '@/entities/accounts';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { useSheet } from '@/shared/lib/hooks/use-sheet';
import { useConfirm } from '@/shared/lib/hooks/use-confirm';

export const AccountsActionsCell = ({ row }: CellContext<Account, unknown>) => {
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    description: `You are about to delete this account.`
  });
  const accountDeleteMutation = useDeleteAccount(row.original.id);
  const openAccountSheet = useSheet<'edit-account'>();

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
          <DropdownMenuItem disabled={accountDeleteMutation.isPending} onClick={() => openAccountSheet.onOpen('edit-account', row.original)}>
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