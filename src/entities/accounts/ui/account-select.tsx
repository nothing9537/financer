'use client';

import { Select } from '@/shared/components/select';

import { useGetAccounts } from '../api/use-get-accounts';
import { useCreateAccount } from '../api/use-create-account';

type AccountSelectProps = {
  disabled?: boolean;
  onChange: (value?: string) => void;
  value: string;
}

export const AccountSelect: React.FC<AccountSelectProps> = ({ disabled, onChange, value }) => {
  const { data } = useGetAccounts();
  const accountMutation = useCreateAccount();

  return (
    <Select
      placeholder="Select an account"
      options={(data || []).map((entity) => ({ label: entity.name, value: entity.id }))}
      onChange={onChange}
      onCreate={(name: string) => accountMutation.mutate({ name })}
      value={value}
      disabled={disabled}
    />
  );
};