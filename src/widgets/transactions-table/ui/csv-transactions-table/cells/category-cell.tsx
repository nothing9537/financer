import { TriangleAlert } from 'lucide-react';
import { CellContext } from '@tanstack/react-table';

import { TxShape } from '@/features/csv-import-button';
import { cn } from '@/shared/lib/utils/cn';

export const CategoryCell = ({ row }: CellContext<TxShape, unknown>) => {
  return (
    <span className={cn("flex items-center cursor-pointer hover:underline", !row.original.category && 'text-rose-500')}>
      {!row.original.category && <TriangleAlert className='size-4 mr-2 shrink-0' />}
      {row.original.category || 'Uncategorized'}
    </span>
  );
};