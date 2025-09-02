import { CellContext } from '@tanstack/react-table';

import { Transaction } from '@/entities/transactions';
import { useSheet } from '@/shared/lib/hooks/use-sheet';

export const AccountCell = ({ row }: CellContext<Transaction, unknown>) => {
  const editAccountSheet = useSheet<'edit-account'>();

  return (
    <span
      className="flex items-center cursor-pointer hover:underline"
      onClick={() => editAccountSheet.onOpen('edit-account', { id: row.original.accountId, name: row.original.account })}
    >
      {row.original.account}
    </span>
  );
};