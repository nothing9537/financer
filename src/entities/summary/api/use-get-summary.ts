'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { client } from '@/shared/api/hono/client';
import { SUMMARY_QUERY_KEYS } from '@/shared/lib/consts/query-keys';
import { convertAmountFromMilliunits } from '@/shared/lib/utils/math';

export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get('from') || "";
  const to = params.get('to') || "";
  const accountId = params.get('accountId') || "";

  const query = useQuery({
    queryKey: SUMMARY_QUERY_KEYS({ accountId, from, to }),
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const { data } = await response.json();

      return {
        ...data,
        incomeAmount: convertAmountFromMilliunits(data.incomeAmount),
        expensesAmount: convertAmountFromMilliunits(data.expensesAmount),
        remainingAmount: convertAmountFromMilliunits(data.remainingAmount),
        categories: data.categories.map((c) => ({
          ...c,
          value: convertAmountFromMilliunits(c.value),
        })),
        days: data.days.map((d) => ({
          ...d,
          income: convertAmountFromMilliunits(d.income),
          expenses: convertAmountFromMilliunits(d.expenses),
        })),
      }
    }
  });

  return query;
}