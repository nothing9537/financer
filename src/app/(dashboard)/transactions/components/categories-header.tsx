'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { CardHeader, CardTitle } from '@/shared/ui/card';
import { useSheet } from '@/shared/lib/hooks/use-sheet';

export const TransactionsPageHeader: React.FC = () => {
  const sheet = useSheet<'new-transaction'>();

  return (
    <CardHeader className='gap-y-2'>
      <CardTitle className='text-xl line-clamp-1'>
        Transactions history
      </CardTitle>
      <Button size='sm' onClick={() => sheet.onOpen('new-transaction')}>
        <Plus className='size-4 mr-2' />
        Add new
      </Button>
    </CardHeader>
  );
};