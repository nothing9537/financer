import { useBulkCreateTransactions, useCSVTransactionsStore } from '@/entities/transactions';
import { convertAmountToMilliunits } from '@/shared/lib/utils/math';
import { useCallback, useMemo } from 'react';

export const useExportCSVTransactions = (successAction?: () => void, errorAction?: () => void) => {
  const { data } = useCSVTransactionsStore();
  const mutation = useBulkCreateTransactions();

  const exportData = useMemo(() => data
    .map(({ id, account, category, ...rest }) => ({ ...rest, amount: convertAmountToMilliunits(rest.amount) }))
    .filter((t) => t.accountId && t.date && t.payee && t.amount), [data]);

  const handleExport = useCallback(() => {
    mutation.mutate(exportData, {
      onSuccess: () => {
        successAction?.();
      },
      onError: () => {
        errorAction?.();
      }
    });
  }, [data, mutation, errorAction, successAction]);

  return [handleExport, mutation, exportData] as const;
}