'use client';

import { FC } from 'react';

import { EditAccountSheet, NewAccountSheet } from '@/widgets/account-sheet';

export const SheetProvider: FC = () => {
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
    </>
  );
};