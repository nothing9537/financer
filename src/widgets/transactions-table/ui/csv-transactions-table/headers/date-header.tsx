import { HeaderContext } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { TxShape } from '@/features/csv-import-button';

export const DateHeader = ({ column }: HeaderContext<TxShape, unknown>) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Date
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
};