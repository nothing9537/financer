import { CellContext } from '@tanstack/react-table';

import { TxShape } from '@/features/csv-import-button';
import { formatAmount } from '@/shared/lib/utils/format';
import { Badge } from '@/shared/ui/badge';

export const AmountCell = ({ row }: CellContext<TxShape, unknown>) => {
  return (
    <Badge
      className='text-xs font-medium px-3.5 py-1'
      variant={row.original.amount < 0 ? 'destructive' : 'primary'}
    >
      {formatAmount(row.original.amount)}
    </Badge>
  );
};