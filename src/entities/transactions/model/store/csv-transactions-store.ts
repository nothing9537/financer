import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { TxShape } from '@/features/csv-import-button';

import { CSVTransactionsStore } from '../types/store';

export const useCSVTransactionsStore = create<CSVTransactionsStore>()(devtools((set) => ({
  data: [],
  setData: (data: TxShape[]) => set({ data }),
  clearData: () => set({ data: [] }),
  updateSingle: (transaction: TxShape) => set((state) => ({ data: state.data.map((tx) => (tx.id === transaction.id ? transaction : tx)) })),
  removeSingle: (id: string) => set((state) => ({ data: state.data.filter((tx) => tx.id !== id) })),
  bulkRemove: (ids: string[]) => set((state) => ({ data: state.data.filter((tx) => !ids.includes(tx.id)) })),
  bulkUpdate: (transactions: TxShape[]) => set((state) => ({
    data: state.data.map((tx) => {
      const updated = transactions.find((t) => t.id === tx.id);
      return updated || tx;
    })
  })),
  categoryBulkUpdate: (categoryId: string, category: string) => set((state) => ({
    data: state.data.map((tx) => (tx.category === category ? { ...tx, category, categoryId } : tx)),
  })),
})));