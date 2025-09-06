'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { FiltersLocalStorageAbstract } from '@/shared/lib/utils/filters-localstorage-abstract';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';

export const SaveFiltersCheckbox: React.FC = () => {
  const [shouldSave, setShouldSave] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const filtersFlag = FiltersLocalStorageAbstract.getFiltersFlag();
    const filtersQueryUrl = FiltersLocalStorageAbstract.getFilters();

    if (filtersFlag !== null) {
      setShouldSave(filtersFlag);

      if (filtersFlag && filtersQueryUrl) {
        router.push(filtersQueryUrl);
      }
    }

  }, [router]);

  const handleSaveFilters = (checked: boolean) => {
    FiltersLocalStorageAbstract.saveFiltersFlag(checked);

    setShouldSave(checked);
  };

  return (
    <div className="flex items-center gap-3 text-white">
      <Checkbox id="terms" className='text-white' checked={shouldSave} onCheckedChange={handleSaveFilters} />
      <Label htmlFor="terms">Save filters on your next session?</Label>
    </div>
  );
};