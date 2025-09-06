'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { useAccountFilter } from '../../lib/hooks/use-account-filter';

export const AccountFilter: React.FC = () => {
  const { isLoading, accountId, onChange, data } = useAccountFilter();

  return (
    <Select disabled={isLoading} value={accountId} onValueChange={onChange}>
      <SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
        <SelectValue placeholder='Account' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>
          All accounts
        </SelectItem>
        {data?.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};