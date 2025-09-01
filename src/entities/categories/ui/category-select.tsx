'use client';

import { Select } from '@/shared/components/select';

import { useGetCategories } from '../api/use-get-categories';
import { useCreateCategory } from '../api/use-create-category';

type AccountSelectProps = {
  disabled?: boolean;
  onChange: (value?: string) => void;
  value: string;
}

export const CategorySelect: React.FC<AccountSelectProps> = ({ disabled, onChange, value }) => {
  const { data } = useGetCategories();
  const categoryMutation = useCreateCategory();

  return (
    <>
      <Select
        placeholder="Select an category"
        options={(data || []).map((entity) => ({ label: entity.name, value: entity.id }))}
        onChange={onChange}
        onCreate={(name: string) => categoryMutation.mutate({ name })}
        value={value}
        disabled={disabled}
      />
    </>
  );
};