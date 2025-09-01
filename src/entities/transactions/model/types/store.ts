import { TxShape } from '@/features/csv-import-button';

export interface CSVTransactionsStore {
  data: TxShape[];

  setData: (data: TxShape[]) => void;
  clearData: () => void;
  updateSingle: (transaction: TxShape) => void;
  removeSingle: (id: string) => void;
  bulkRemove: (ids: string[]) => void;
}