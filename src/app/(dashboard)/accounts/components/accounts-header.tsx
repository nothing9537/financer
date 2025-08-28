'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { CardHeader, CardTitle } from '@/shared/ui/card';
import { useSheet } from '@/shared/lib/hooks/use-sheet';

export const AccountsHeader: React.FC = () => {
  const sheet = useSheet<'new-account'>();

  return (
    <CardHeader className='gap-y-2'>
      <CardTitle className='text-xl line-clamp-1'>
        Accounts page
      </CardTitle>
      <Button size='sm' onClick={() => sheet.onOpen('new-account')}>
        <Plus className='size-4 mr-2' />
        Add new
      </Button>
    </CardHeader>
  );
};