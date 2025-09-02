import { HeaderContext } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { TxShape } from '@/features/csv-import-button';
import { Button } from '@/shared/ui/button';

export const PayeeHeader = ({ column }: HeaderContext<TxShape, unknown>) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Payee
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
};