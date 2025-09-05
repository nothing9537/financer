import { format } from 'date-fns';
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';

import { formatAmount } from '@/shared/lib/utils/format';
import { Separator } from '@/shared/ui/separator';

export const CategoryTooltip = ({ active, payload }: TooltipContentProps<number, string>) => {
  if (!active) {
    return null;
  }

  const name = payload[0].payload.name as string;
  const value = payload[0].value as number;

  return (
    <div className='rounded-sm bg-white shadow-sm border overflow-hidden'>
      <div className='text-sm p-2 px-3 bg-muted text-muted-foreground'>
        {name}
      </div>
      <Separator />
      <div className='p-2 px-3 space-y-1'>
        <div className='flex items-center justify-between gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <div className='size-1.5 bg-rose-500 rounded-full' />
            <p className='text-sm text-muted-foreground'>
              Expenses
            </p>
            <p className='text-sm text-right font-medium'>
              {formatAmount(value * -1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};