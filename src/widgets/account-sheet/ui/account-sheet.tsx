'use client';

import { FC } from 'react';

import { SheetType, useSheet } from '@/shared/lib/hooks/use-sheet';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/ui/sheet';

interface AccountSheetProps {
  children: React.ReactNode;
  type: SheetType;
  title: string;
  description: string;
}

export const AccountSheet: FC<AccountSheetProps> = ({ children, type, title, description }) => {
  const sheet = useSheet<'new-account'>();

  return (
    <Sheet open={sheet.isOpen && sheet.type === type} onOpenChange={sheet.onClose}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>
            {title}
          </SheetTitle>
          <SheetDescription>
            {description}
          </SheetDescription>
          {children}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};