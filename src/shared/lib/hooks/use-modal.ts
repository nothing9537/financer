import { Category } from '@/entities/categories';
import { TxShape } from '@/features/csv-import-button';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

const MODAL_TYPES = ['create-category-confirmation', 'apply-account-modal'] as const;
export type ModalType = (typeof MODAL_TYPES)[number];

interface CreateCategoryConfirmationModalData {
  onConfirm?: (data: Category) => void;
  onCancel?: () => void;
  transaction: TxShape;
}

type ModalDataMap = {
  'create-category-confirmation': CreateCategoryConfirmationModalData;
  'apply-account-modal': undefined;
}

interface ModalState {
  type: ModalType | null;
  data?: ModalDataMap[ModalType] | undefined;
  isOpen: boolean;
  onClose: () => void;
  onOpen: <T extends ModalType>(type: T, data?: ModalDataMap[T] | undefined) => void;
}

export const useGeneralModal = create<ModalState>()(devtools((set) => ({
  data: undefined,
  isOpen: false,
  type: null,
  onOpen: (type, data = undefined) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: undefined }),
})));

export type ModalStateFor<T extends ModalType> = Omit<ModalState, 'onOpen' | 'data'> & {
  data: ModalDataMap[T] | undefined;
  onOpen: (type: T, data?: ModalDataMap[T] | undefined) => void;
}

export const useModal = <T extends ModalType>(): ModalStateFor<T> => {
  const modal = useGeneralModal();

  return {
    ...modal,
    data: modal.data as ModalDataMap[T] | undefined,
    onOpen: (type, data = undefined) => modal.onOpen(type, data),
  };
};