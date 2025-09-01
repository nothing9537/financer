import { Transaction } from '@/entities/transactions';
import { ColumnDef } from '@tanstack/react-table';

import { CategoryHeader } from '../../ui/transactions-table/headers/category-header';
import { AccountHeader } from '../../ui/transactions-table/headers/account-header';
import { SelectHeader } from '../../ui/common-headers/select-header';
import { AmountHeader } from '../../ui/transactions-table/headers/amount-header';
import { PayeeHeader } from '../../ui/transactions-table/headers/payee-header';
import { DateHeader } from '../../ui/transactions-table/headers/date-header';

import { TransactionsActionsCell } from '../../ui/transactions-table/cells/transactions-actions-cell';
import { SelectCell } from '../../ui/common-cells/select-cell';
import { DateCell } from '../../ui/transactions-table/cells/date-cell';
import { AmountCell } from '../../ui/transactions-table/cells/amount-cell';
import { AccountCell } from '../../ui/transactions-table/cells/account-cell';
import { CategoryCell } from '../../ui/transactions-table/cells/category-cell';
import { NotesCell } from '../../ui/transactions-table/cells/notes-cell';

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
    accessorKey: 'notes',
    header: "Notes",
    cell: NotesCell,
  },
  {
    id: 'actions',
    cell: TransactionsActionsCell,
  },
];