import { Input } from '@/shared/ui/input';
import { DataTableFiltering, DataTableProps } from './types';

type DataTableFilterProps<TData, TValue> = Omit<DataTableProps<TData, TValue>, 'columns'> & { filter?: DataTableFiltering };

export function DataTableFilter<TData, TValue>({ table, filter }: DataTableFilterProps<TData, TValue>) {
  if (filter?.key) {
    <Input
      placeholder={filter?.placeholder || 'Filter...'}
      value={(table.getColumn(filter.key)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(filter.key)?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  }

  return null;
}