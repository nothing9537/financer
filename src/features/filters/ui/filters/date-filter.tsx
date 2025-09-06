'use client';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { formatDateRange } from '@/shared/lib/utils/format';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

import { useDateFilter } from '../../lib/hooks/use-date-filter';

export const DateFilter: React.FC = () => {
  const { paramState, date, onReset, pushToUrl, setDate } = useDateFilter();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={false} variant='outline' size='sm' className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
          {formatDateRange(paramState)}
          <ChevronDown className='size-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='lg:w-auto w-full p-0' align='start'>
        <Calendar
          disabled={false}
          initialFocus
          mode='range'
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className='p-4 w-full grid grid-cols-2 gap-x-2'>
          <PopoverClose asChild>
            <Button
              onClick={onReset}
              disabled={!date?.from || !date?.to}
              className='w-full'
              variant='outline'
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              onClick={() => pushToUrl(date)}
              disabled={!date?.from || !date?.to}
              className='w-full'
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};