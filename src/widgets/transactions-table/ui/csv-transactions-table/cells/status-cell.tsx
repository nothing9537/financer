import { Check, TriangleAlert } from 'lucide-react';
import { CellContext } from '@tanstack/react-table';

import { TxShape } from '@/features/csv-import-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

export const StatusCell = ({ row }: CellContext<TxShape, unknown>) => {
  const missingFields = [];
  if (!row.original.account) missingFields.push('Account');
  if (!row.original.amount) missingFields.push('Amount');
  if (!row.original.payee) missingFields.push('Payee');

  if (!row.original.account) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <div className='flex items-center text-rose-500 hover:underline'>
              <TriangleAlert className='size-4 mr-1' />
              <p>Couldn&apos;t be processed</p>
            </div>
            <p className='text-xs text-muted-foreground'>
              Hover to see missing fields
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <span>{missingFields.join(', ')}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className='flex items-center text-emerald-500'>
      <Check className='size-4 mr-1' />
      <p>Will be processed</p>
    </div>
  )
};