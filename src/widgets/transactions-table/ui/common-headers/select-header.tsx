import { HeaderContext } from '@tanstack/react-table';

import { Checkbox } from '@/shared/ui/checkbox';

export function SelectHeader<TData, TValue>({ table }: HeaderContext<TData, TValue>){
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