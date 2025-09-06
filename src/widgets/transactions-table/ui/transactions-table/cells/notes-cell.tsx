import { useMedia } from 'react-use';
import { CellContext } from '@tanstack/react-table';

import { Transaction } from '@/entities/transactions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

export const NotesCell = ({ row }: CellContext<Transaction, Transaction[]>) => {
  const isMobile = useMedia('(max-width: 1024px)', false);

  if (!row.original.notes) {
    return <span>No notes</span>;
  }

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <span className='hover:underline cursor-pointer text-muted-foreground'>
            [tap to see]
          </span>
        </PopoverTrigger>
        <PopoverContent align="start" className="max-w-[90vw]">
          <pre className="whitespace-pre-wrap break-words text-sm leading-snug">
            {row.original.notes}
          </pre>
        </PopoverContent>
      </Popover>
    )
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