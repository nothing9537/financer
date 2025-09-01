import { ColumnDef } from '@tanstack/react-table';

import { TxShape } from '@/features/csv-import-button';

import { CategoryHeader } from '../../ui/csv-transactions-table/headers/category-header';
import { AccountHeader } from '../../ui/csv-transactions-table/headers/account-header';
import { AmountHeader } from '../../ui/csv-transactions-table/headers/amount-header';
import { PayeeHeader } from '../../ui/csv-transactions-table/headers/payee-header';
import { DateHeader } from '../../ui/csv-transactions-table/headers/date-header';
import { SelectHeader } from '../../ui/common-headers/select-header';

import { CSVTransactionsActionsCell } from '../../ui/csv-transactions-table/cells/transactions-actions-cell';
import { CategoryCell } from '../../ui/csv-transactions-table/cells/category-cell';
import { AccountCell } from '../../ui/csv-transactions-table/cells/account-cell';
import { AmountCell } from '../../ui/csv-transactions-table/cells/amount-cell';
import { StatusCell } from '../../ui/csv-transactions-table/cells/status-cell';
import { DateCell } from '../../ui/csv-transactions-table/cells/date-cell';
import { SelectCell } from '../../ui/common-cells/select-cell';

export const columns: ColumnDef<TxShape, TxShape[]>[] = [
  {
    id: "select",
    header: SelectHeader,
    cell: SelectCell,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'date',
    accessorKey: 'date',
    header: DateHeader,
    cell: DateCell,
  },
  {
    accessorKey: 'category',
    header: CategoryHeader,
    cell: CategoryCell,
  },
  {
    accessorKey: 'payee',
    header: PayeeHeader,
  },
  {
    accessorKey: 'amount',
    header: AmountHeader,
    cell: AmountCell,
  },
  {
    accessorKey: 'account',
    header: AccountHeader,
    cell: AccountCell,
  },
  {
    header: "Status",
    cell: StatusCell,
  },
  {
    id: 'actions',
    cell: CSVTransactionsActionsCell,
  },
];