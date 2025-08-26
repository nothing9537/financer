'use client';
import { FC } from 'react';

import { useSheet } from '@/shared/lib/hooks/use-sheet';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/ui/sheet';

interface AccountSheetProps {
  children: React.ReactNode
}

export const AccountSheet: FC<AccountSheetProps> = ({ children }) => {
  const sheet = useSheet();

  return (
    <Sheet open={sheet.isOpen && sheet.type === 'new-account'} onOpenChange={sheet.onClose}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>
            New Account
          </SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
          {children}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};