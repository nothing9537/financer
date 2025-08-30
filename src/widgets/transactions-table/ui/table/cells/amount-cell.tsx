import { CellContext } from '@tanstack/react-table';

import { Transaction } from '@/entities/transactions';
import { formatAmount } from '@/shared/lib/utils/format';
import { Badge } from '@/shared/ui/badge';

export const AmountCell = ({ row }: CellContext<Transaction, unknown>) => {
  return (
    <Badge
      className='text-xs font-medium px-3.5 py-1'
      variant={row.original.amount < 0 ? 'destructive' : 'primary'}
    >
      {formatAmount(row.original.amount)}
    </Badge>
  );
};