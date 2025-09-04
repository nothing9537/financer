// features/csv-import-button/ui/csv-import-button.tsx
'use client';

import * as React from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/shared/ui/button';

import { useGetCategories } from '@/entities/categories';

import { parseCsvFileClient } from '../lib/papaparse-client';
import { normalizeRowsToTxShape } from '../lib/parse';
import type { TxShape } from '../model/types';

type CSVImportButtonProps = {
  onImport: (data: TxShape[]) => void;
  onPickerOpen?: () => void;
};

export const CSVImportButton: React.FC<CSVImportButtonProps> = ({
  onImport,
  onPickerOpen,
}) => {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [isBusy, setIsBusy] = React.useState(false);
  const { data } = useGetCategories();

  const openPicker = () => {
    onPickerOpen?.();
    fileRef.current?.click();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsBusy(true);
    try {
      const rawRows = await parseCsvFileClient(file);
      const out: TxShape[] = data
        ? normalizeRowsToTxShape(rawRows).map((t) => {
          const category = data.find((c) => c.name === t.category);

          if (category) {
            return { ...t, categoryId: category.id }
          }

          return t;
        })
        : normalizeRowsToTxShape(rawRows);

      onImport?.(out);
    } finally {
      setIsBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const buttonContent = isBusy ? (
    <Loader2 className="size-4 animate-spin" />
  ) : (
    <>
      <Upload className="size-4 mr-2" />
      Import
    </>
  );

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={onFile}
      />
      <Button onClick={openPicker} size="sm" disabled={isBusy}>
        {buttonContent}
      </Button>
    </>
  );
};
