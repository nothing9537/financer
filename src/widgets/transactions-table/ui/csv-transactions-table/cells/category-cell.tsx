import { TriangleAlert } from 'lucide-react';
import { CellContext } from '@tanstack/react-table';

import { TxShape } from '@/features/csv-import-button';
import { cn } from '@/shared/lib/utils/cn';
import { useModal } from '@/shared/lib/hooks/use-modal';
import { useCSVTransactionsStore } from '@/entities/transactions';

export const CategoryCell = ({ row }: CellContext<TxShape, unknown>) => {
  const { onOpen } = useModal<'create-category-confirmation'>();
  const { categoryBulkUpdate } = useCSVTransactionsStore();

  const handleClick = () => {
    if (!row.original.categoryId) {
      onOpen(
        'create-category-confirmation',
        {
          transaction: row.original,
          onConfirm: ({ name, id }) => categoryBulkUpdate(id, name),
        }
      );
    }
  };

  return (
    <span
      className={cn("flex items-center cursor-pointer hover:underline", !row.original.category && 'text-rose-500', !row.original.categoryId && 'text-shadow-muted-foreground')}
      onClick={handleClick}
    >
      <div className='flex flex-col'>
        <div className='flex items-center'>
          {(!row.original.category || !row.original.categoryId) && <TriangleAlert className='size-4 mr-2 shrink-0' />}
          {row.original.category || 'Uncategorized'}
        </div>
        {!row.original.categoryId && (
          <p className='text-xs text-muted-foreground'>
            No category found
          </p>
        )}
      </div>
    </span>
  );
};