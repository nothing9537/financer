"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Account } from '@/entities/accounts';

import { AccountsActionsCell } from '../../ui/table/cells/accounts-actions-cell';
import { NameHeader } from '../../ui/table/headers/name-header';
import { SelectHeader } from '../../ui/table/headers/select-header';
import { SelectCell } from '../../ui/table/cells/select-cell';
import { CategoriesActionsCell } from '../../ui/table/cells/categories-actions-cell';

export const accountsColumns: ColumnDef<Account>[] = [
  {
    id: "select",
    header: SelectHeader,
    cell: SelectCell,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: NameHeader,
  },
  {
    id: 'actions',
    cell: AccountsActionsCell,
  },
];

export const categoriesColumns: ColumnDef<Account>[] = [
  {
    id: "select",
    header: SelectHeader,
    cell: SelectCell,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: NameHeader,
  },
  {
    id: 'actions',
    cell: CategoriesActionsCell,
  }
];
