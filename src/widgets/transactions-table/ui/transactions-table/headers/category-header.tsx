import { HeaderContext } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Transaction } from '@/entities/transactions';
import { Button } from '@/shared/ui/button';

export const CategoryHeader = ({ column }: HeaderContext<Transaction, unknown>) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Category
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
};