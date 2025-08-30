import { Transaction } from '@/entities/transactions';
import { ColumnDef } from '@tanstack/react-table';

import { CategoryHeader } from '../../ui/table/headers/category-header';
import { AccountHeader } from '../../ui/table/headers/account-header';
import { SelectHeader } from '../../ui/table/headers/select-header';
import { AmountHeader } from '../../ui/table/headers/amount-header';
import { PayeeHeader } from '../../ui/table/headers/payee-header';
import { DateHeader } from '../../ui/table/headers/date-header';

import { TransactionsActionsCell } from '../../ui/table/cells/transactions-actions-cell';
import { SelectCell } from '../../ui/table/cells/select-cell';
import { DateCell } from '../../ui/table/cells/date-cell';
import { AmountCell } from '../../ui/table/cells/amount-cell';
import { AccountCell } from '../../ui/table/cells/account-cell';
import { CategoryCell } from '../../ui/table/cells/category-cell';

export const columns: ColumnDef<Transaction>[] = [
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
    id: 'actions',
    cell: TransactionsActionsCell,
  },
];