'use client';

import { EditAccountSheet, EditCategorySheet, NewAccountSheet, NewCategorySheet } from '@/widgets/entity-sheet';
import { NewTransactionSheet } from '@/widgets/transaction-sheet';

export const SheetProvider: React.FC = () => {
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <EditCategorySheet />
      <NewCategorySheet />
      <NewTransactionSheet />
    </>
  );
};