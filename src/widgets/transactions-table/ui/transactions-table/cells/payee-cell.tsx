'use client';

import * as React from 'react';
import type { CellContext } from '@tanstack/react-table';
import type { Transaction } from '@/entities/transactions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

const MAX_LEN = 40;

function useCoarsePointer() {
  const [coarse, setCoarse] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener ? mq.addEventListener('change', update) : mq.addListener(update);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', update) : mq.removeListener(update );
    };
  }, []);
  return coarse;
}

export function PayeeCell({ row }: CellContext<Transaction, unknown>) {
  const payee = (row.original.payee ?? '').trim();
  const isMobile = useCoarsePointer();
  if (!payee) return <span className="text-muted-foreground">—</span>;

  const long = payee.length > MAX_LEN;

  const truncated = (
    <span
      className="block max-w-[420px] truncate whitespace-nowrap"
      title={long ? payee : undefined}
    >
      {payee}
    </span>
  );

  if (!long) return truncated;

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="block w-full text-left max-w-[70vw] truncate whitespace-nowrap underline decoration-dotted underline-offset-2"
          >
            {payee}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="max-w-[90vw]">
          <pre className="whitespace-pre-wrap break-words text-sm leading-snug">
            {payee}
          </pre>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="block max-w-[420px] truncate whitespace-nowrap hover:underline cursor-help">
            {payee}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[50vw]">
          <pre className="whitespace-pre-wrap break-words text-sm leading-snug">
            {payee}
          </pre>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
