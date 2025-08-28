import { CellContext } from '@tanstack/react-table';

import { Account } from '@/entities/accounts';
import { Checkbox } from '@/shared/ui/checkbox';

export const SelectCell = ({ row }: CellContext<Account, unknown>) => {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  )
};