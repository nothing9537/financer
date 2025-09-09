'use client';

import { CategoryCreateConfirmationModal } from '@/entities/categories';
import { PaywallModal } from '@/entities/subscriptions';
import { ApplyAccountModal } from '@/widgets/transactions-table';

export const ModalProvider: React.FC = () => {
  return (
    <>
      <CategoryCreateConfirmationModal />
      <ApplyAccountModal />
      <PaywallModal />
    </>
  )
}