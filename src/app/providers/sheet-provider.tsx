'use client';

import { EditAccountSheet, EditCategorySheet, NewAccountSheet, NewCategorySheet } from '@/widgets/entity-sheet';
import { EditTransactionSheet, NewTransactionSheet } from '@/widgets/transaction-sheet';

export const SheetProvider: React.FC = () => {
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />

      <NewCategorySheet />
      <EditCategorySheet />

      <NewTransactionSheet />
      <EditTransactionSheet />
    </>
  );
};