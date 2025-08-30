'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { SelectSingleEventHandler } from 'react-day-picker';

import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils/cn';
import { Calendar } from '@/shared/ui/calendar';

type DatePickerProps = {
  value?: Date;
  onChange?: SelectSingleEventHandler;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, disabled }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={disabled} variant="outline" className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}>
          <CalendarIcon className='size-4 mr-2' />
          {value ? (
            format(value, 'PPP')
          ) : (
            <span>
              Pick a date
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};