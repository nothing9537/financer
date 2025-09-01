import { CellContext } from '@tanstack/react-table';

import { TxShape } from '@/features/csv-import-button';
// import { useSheet } from '@/shared/lib/hooks/use-sheet';

export const AccountCell = ({ row }: CellContext<TxShape, unknown>) => {
  // const editAccountSheet = useSheet<'edit-account'>();

  return (
    <span
      className="flex items-center cursor-pointer hover:underline"
      // onClick={() => editAccountSheet.onOpen('edit-account', { id: row.original.accountId, name: row.original.account })}
    >
      {row.original.account}
    </span>
  );
};