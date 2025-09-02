import { CellContext } from '@tanstack/react-table';

import { TxShape } from '@/features/csv-import-button';

export const AccountCell = ({ row }: CellContext<TxShape, unknown>) => {

  return (
    <span>
      {row.original.account}
    </span>
  );
};