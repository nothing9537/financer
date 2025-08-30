import { HeaderContext } from '@tanstack/react-table';

import { Transaction } from '@/entities/transactions';
import { Checkbox } from '@/shared/ui/checkbox';

export const SelectHeader = ({ table }: HeaderContext<Transaction, unknown>) => {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  )
};