export type TxShape = {
  id: string;
  amount: number;
  payee: string;
  date: string;
  category?: string | null;
  categoryId?: string | null;
  account?: string;
  notes?: string | null;
  accountId: string;
};
