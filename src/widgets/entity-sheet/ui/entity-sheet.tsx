'use client';

import { FC } from 'react';

import { SheetType, useSheet } from '@/shared/lib/hooks/use-sheet';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/ui/sheet';

interface EntitySheetProps {
  children: React.ReactNode;
  type: SheetType;
  title: string;
  description: string;
}

export const EntitySheet: FC<EntitySheetProps> = ({ children, type, title, description }) => {
  const sheet = useSheet();

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