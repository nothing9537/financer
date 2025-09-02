import { format } from 'date-fns';
import { CellContext } from '@tanstack/react-table';

import { Transaction } from '@/entities/transactions';

export const DateCell = ({ row }: CellContext<Transaction, unknown>) => {
  return (
    <span>
      {format(row.original.date, 'dd MMMM, yyyy')}
    </span>
  );
};