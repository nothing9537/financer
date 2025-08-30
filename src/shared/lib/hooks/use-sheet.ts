import { Account } from '@/entities/accounts';
import { Category } from '@/entities/categories';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

const SHEET_TYPES = ['new-account', 'edit-account', 'new-category', 'edit-category', 'new-transaction'] as const;
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
}

interface SheetState {
  type: SheetType | null;
  data: SheetDataMap[SheetType] | null;
  isOpen: boolean;
  onClose: () => void;
  onOpen: <T extends SheetType>(type: T, data?: SheetDataMap[T] | null) => void;
}

export const useGeneralSheet = create<SheetState>()(devtools((set) => ({
  data: null,
  isOpen: false,
  type: null,
  onOpen: (type, data = null) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: null }),
})));

type SheetStateFor<T extends SheetType> = Omit<SheetState, 'onOpen' | 'data'> & {
  data: SheetDataMap[T] | null;
  onOpen: (type: T, data?: SheetDataMap[T] | null) => void;
}

export const useSheet = <T extends SheetType>(): SheetStateFor<T> => {
  const sheet = useGeneralSheet();

  return {
    ...sheet,
    data: sheet.data as SheetDataMap[T] | null,
    onOpen: (type, data = null) => sheet.onOpen(type, data),
  };
};