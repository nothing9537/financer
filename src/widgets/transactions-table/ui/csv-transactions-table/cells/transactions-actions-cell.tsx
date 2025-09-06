'use client';

import React, { useCallback } from 'react';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import type { CellContext } from '@tanstack/react-table';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { useSheet } from '@/shared/lib/hooks/use-sheet';
import { useConfirm } from '@/shared/lib/hooks/use-confirm';
import { Button } from '@/shared/ui/button';
import { TxShape } from '@/features/csv-import-button';
import { useCSVTransactionsStore } from '@/entities/transactions';
import { useModal } from '@/shared/lib/hooks/use-modal';
import { useGetCategories } from '@/entities/categories';

type Props = CellContext<TxShape, unknown>;

export const CSVTransactionsActionsCell = ({ row }: Props): React.ReactElement => {
  const editSheet = useSheet<'edit-csv-transaction'>();
  const { onOpen: openModal } = useModal<'create-category-confirmation'>();
  const { data: categories } = useGetCategories();
  const { removeSingle, categoryBulkUpdate } = useCSVTransactionsStore();
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    description: 'You are about to delete this transaction.'
  });

  const tx = row.original;

  const openEditSheet = useCallback((transaction: TxShape) => {
    editSheet.onOpen('edit-csv-transaction', transaction);
  }, [editSheet]);

  const onEdit = useCallback(() => {
    const categoryName = tx?.category;

    if (!categoryName || !categories) {
      openEditSheet(tx);
      return;
    }

    const category = categories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase());

    if (!category) {
      openModal('create-category-confirmation', {
        transaction: tx,
        onConfirm: ({ name, id }) => {
          const updated = { ...tx, category: name, categoryId: id };
          
          categoryBulkUpdate(id, name);
          openEditSheet(updated);
        },
        onCancel: () => openEditSheet(tx),
      });
      return;
    }

    openEditSheet({ ...tx, categoryId: category.id, category: category.name });
  }, [tx, categories, openModal, openEditSheet, categoryBulkUpdate]);

  const handleDelete = useCallback(async () => {
    const ok = await confirm();
    if (ok) removeSingle(tx.id);
  }, [confirm, removeSingle, tx.id]);

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-rose-500">
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};