import { CellContext } from '@tanstack/react-table';

import { Checkbox } from '@/shared/ui/checkbox';

export function SelectCell<TData, TValue>({ row }: CellContext<TData, TValue>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  )
};