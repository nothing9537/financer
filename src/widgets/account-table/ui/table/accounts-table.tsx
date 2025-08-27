'use client';

import { DataTable } from '@/shared/components/data-table/data-table';
import { columns, Payment } from '../../lib/consts/columns';

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "718ed52f",
    amount: 72,
    status: "success",
    email: "a@example.com",
  },
  {
    id: "738ed52f",
    amount: 6,
    status: "pending",
    email: "b@example.com",
  },
  {
    id: "748ed52f",
    amount: 170,
    status: "failed",
    email: "test@gmail.com",
  },
]

export const AccountsTable: React.FC = () => {
  return (
    <DataTable
      columns={columns}
      data={data}
    />
  );
};