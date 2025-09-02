'use client';

import { CategoryCreateConfirmationModal } from '@/entities/categories';
import { ApplyAccountModal } from '@/widgets/transactions-table';

export const ModalProvider: React.FC = () => {
  return (
    <>
      <CategoryCreateConfirmationModal />
      <ApplyAccountModal />
    </>
  )
}