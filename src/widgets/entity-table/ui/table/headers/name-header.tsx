import { HeaderContext } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Account } from '@/entities/accounts';
import { Button } from '@/shared/ui/button';

export const NameHeader = ({ column }: HeaderContext<Account, unknown>) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Name
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
};