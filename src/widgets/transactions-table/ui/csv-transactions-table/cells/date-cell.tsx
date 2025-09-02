import { format } from 'date-fns';
import { CellContext } from '@tanstack/react-table';

import { TxShape } from '@/features/csv-import-button';

export const DateCell = ({ row }: CellContext<TxShape, unknown>) => {
  return (
    <span>
      {format(row.original.date, 'dd MMMM, yyyy')}
    </span>
  );
};