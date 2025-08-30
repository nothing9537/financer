import { CellContext } from '@tanstack/react-table';

import { Transaction } from '@/entities/transactions';
import { Checkbox } from '@/shared/ui/checkbox';

export const SelectCell = ({ row }: CellContext<Transaction, unknown>) => {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  )
};