import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

type SheetType = 'new-account' | 'edit-account' | 'delete-account';

interface SheetState {
  type: SheetType | null;
  isOpen: boolean;
  onClose: () => void;
  onOpen: (type: SheetType) => void;
}

export const useSheet = create<SheetState>()(devtools((set) => ({
  isOpen: false,
  type: null,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false, type: null }),
})));