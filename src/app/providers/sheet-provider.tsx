'use client';

import { FC } from 'react';

import { NewAccountSheet } from '@/widgets/account-sheet';

export const SheetProvider: FC = () => {
  return (
    <>
      <NewAccountSheet />
    </>
  );
};