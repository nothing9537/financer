import { format, subDays } from 'date-fns';
import { ReadonlyURLSearchParams } from 'next/navigation';
import qs from 'query-string';

export const formatAmount = (value: number) => Intl.NumberFormat("en-US", {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
}).format(value);

type Period = {
  from?: string | Date | string;
  to?: string | Date | string;
}

export const formatDateRange = (period?: Period) => {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, 'LLL dd, y')}`
  }

  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(period.to, 'LLL dd, y')}`
  }

  return format(period.from, 'LLL dd, y');
}

export const formatPercentage = (value: number, options: { addPrefix?: boolean } = { addPrefix: false }) => {
  const res = new Intl.NumberFormat("en-US", {
    style: 'percent'
  }).format(value / 100);

  if (options?.addPrefix && value > 0) {
    return `+${res}`;
  }

  return res;
}


const KEYS = ['accountId', 'from', 'to'] as const;

export function withFilters(href: string, params: ReadonlyURLSearchParams) {
  const query: Record<string, string> = {};
  for (const k of KEYS) {
    const v = params.get(k);
    if (v) query[k] = v;
  }
  return qs.stringifyUrl({ url: href, query }, { skipEmptyString: true, skipNull: true });
}