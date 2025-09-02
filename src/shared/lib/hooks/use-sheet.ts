import { Account } from '@/entities/accounts';
import { Category } from '@/entities/categories';
import { Transaction } from '@/entities/transactions';
import { TxShape } from '@/features/csv-import-button';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

const SHEET_TYPES = ['new-account', 'edit-account', 'new-category', 'edit-category', 'new-transaction', 'edit-transaction', 'edit-csv-transaction'] as const;
export type SheetType = (typeof SHEET_TYPES)[number];

interface EditEntitySheetData {
  name: string;
  id: string;
}

interface NewTransactionSheetData {
  category: Category;
  account: Account;
}

type SheetDataMap = {
  'new-account': undefined;
  'edit-account': EditEntitySheetData;
  'new-category': undefined;
  'edit-category': EditEntitySheetData;
  'new-transaction': NewTransactionSheetData,
  'edit-transaction': Transaction;
  'edit-csv-transaction': TxShape;
}

interface SheetState {
  type: SheetType | null;
  data?: SheetDataMap[SheetType] | undefined;
  isOpen: boolean;
  onClose: () => void;
  onOpen: <T extends SheetType>(type: T, data?: SheetDataMap[T] | undefined) => void;
}

export const useGeneralSheet = create<SheetState>()(devtools((set) => ({
  data: undefined,
  isOpen: false,
  type: null,
  onOpen: (type, data = undefined) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: undefined }),
})));

export type SheetStateFor<T extends SheetType> = Omit<SheetState, 'onOpen' | 'data'> & {
  data: SheetDataMap[T] | undefined;
  onOpen: (type: T, data?: SheetDataMap[T] | undefined) => void;
}

export const useSheet = <T extends SheetType>(): SheetStateFor<T> => {
  const sheet = useGeneralSheet();

  return {
    ...sheet,
    data: sheet.data as SheetDataMap[T] | undefined,
    onOpen: (type, data = undefined) => sheet.onOpen(type, data),
  };
};