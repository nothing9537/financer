'use client';

import { useMemo } from 'react';
import { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { SelectOption } from '@/shared/types/select-option';

export type SelectProps<TValue = string> = {
  onChange: (value?: TValue, label?: string) => void;
  onCreate?: (value: TValue) => void;
  options?: SelectOption<TValue>[];
  value?: TValue | null | undefined;
  disabled?: boolean;
  placeholder?: string;
}

export function Select<TValue = string>({ onChange, onCreate, options = [], value, disabled, placeholder }: SelectProps<TValue>) {
  const onSelect = (option: SingleValue<SelectOption<TValue>>) => {
    onChange(option?.value, option?.label);
  };

  const formattedValue = useMemo(() => options.find((option) => option.value === value), [options, value]);

  return (
    <CreatableSelect
      placeholder={placeholder}
      className='text-sm h-10'
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate as never}
      isDisabled={disabled}
      styles={{
        control: (base) => ({
          ...base,
          borderColor: '#e2e8f0',
          ':hover': {
            borderColor: '#e2e8f0',
          }
        })
      }}
    />
  )
};