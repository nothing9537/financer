import qs from 'query-string';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useDateFilter = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const accountId = params.get('accountId');
  const from = params.get('from') || '';
  const to = params.get('to') || '';

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);

  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defaultFrom, 'yyyy-MM-dd'),
      to: format(dateRange?.to || defaultTo, 'yyyy-MM-dd'),
      accountId,
    };

    const url = qs.stringifyUrl({
      url: pathname,
      query,
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  };

  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  return { date, onReset, pushToUrl, paramState, setDate } as const;
}