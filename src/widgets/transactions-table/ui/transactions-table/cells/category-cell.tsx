import { CellContext } from '@tanstack/react-table';

import { Transaction } from '@/entities/transactions';
import { useSheet } from '@/shared/lib/hooks/use-sheet';
import { TriangleAlert } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';

export const CategoryCell = ({ row }: CellContext<Transaction, unknown>) => {
  const editCategorySheet = useSheet<'edit-category'>();
  const editTransactionSheet = useSheet<'edit-transaction'>();

  const handleCategory = () => {
    if (row.original.categoryId && row.original.category) {
      editCategorySheet.onOpen('edit-category', { id: row.original.categoryId, name: row.original.category })
    } else {
      editTransactionSheet.onOpen('edit-transaction', { ...row.original });
    }
  }

  return (
    <span
      className={cn("flex items-center cursor-pointer hover:underline", !row.original.category && 'text-rose-500')}
      onClick={handleCategory}
    >
      {!row.original.category && <TriangleAlert className='size-4 mr-2 shrink-0' />}
      {row.original.category || 'Uncategorized'}
    </span>
  );
};