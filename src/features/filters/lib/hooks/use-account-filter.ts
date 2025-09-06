import { useGetAccounts } from '@/entities/accounts';
import { FiltersLocalStorageAbstract } from '@/shared/lib/utils/filters-localstorage-abstract';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';

export const useAccountFilter = () => {
  const { data, isLoading } = useGetAccounts();
  const params = useSearchParams();

  const router = useRouter();
  const pathname = usePathname();

  const accountId = params.get('accountId') || 'all';
  const from = params.get('from') || '';
  const to = params.get('to') || '';

  const onChange = (newValue: string) => {
    const query = {
      accountId: newValue,
      from,
      to,
    };

    if (newValue === 'all') {
      query.accountId = '';
    }

    const url = qs.stringifyUrl({
      url: pathname,
      query
    }, { skipNull: true, skipEmptyString: true });

    const isSaveFilters = FiltersLocalStorageAbstract.getFiltersFlag();

    if (isSaveFilters) {
      FiltersLocalStorageAbstract.saveFilters(url);
    }

    router.push(url);
  };

  return {
    data,
    isLoading,
    onChange,
    accountId,
  } as const;
}