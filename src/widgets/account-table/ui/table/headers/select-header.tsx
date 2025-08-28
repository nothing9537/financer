import { HeaderContext } from '@tanstack/react-table';

import { Account } from '@/entities/accounts';
import { Checkbox } from '@/shared/ui/checkbox';

export const SelectHeader = ({ table }: HeaderContext<Account, unknown>) => {
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