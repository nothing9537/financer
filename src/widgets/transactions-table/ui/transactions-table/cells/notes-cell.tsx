import { CellContext } from '@tanstack/react-table';

import { Transaction } from '@/entities/transactions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

export const NotesCell = ({ row }: CellContext<Transaction, unknown>) => {
  if (!row.original.notes) {
    return <span>No notes</span>;
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <span className='hover:underline cursor-pointer text-muted-foreground'>
            [hover to see]
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <pre>
            {row.original.notes}
          </pre>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
};