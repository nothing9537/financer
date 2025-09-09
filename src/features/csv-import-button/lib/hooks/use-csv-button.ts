'use client';

import * as React from 'react';
import { parseCsvFileClient } from '../papaparse-client';
import { normalizeRowsToTxShape } from '../parse';
import type { TxShape } from '../../model/types';
import type { CSVImportButtonProps } from '../../ui/csv-import-button';
import { mapCategoryWithTfIdf } from '../map-category-with-tfidf';

export const useCSVButton = ({ onImport, onPickerOpen }: CSVImportButtonProps) => {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [isBusy, setIsBusy] = React.useState(false);

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
      const base: TxShape[] = normalizeRowsToTxShape(rawRows);

      const out: TxShape[] = base.map((t) => {
        if (!t.category && !t.payee) return t;

        const hit = mapCategoryWithTfIdf({
          baseCategory: t.category,
          payee: t.payee,
          type: undefined,
          amount: t.amount,
        });

        if (hit) {
          return { ...t, categoryId: hit.id, category: hit.name };
        }
        
        return t;
      });

      onImport?.(out);
    } finally {
      setIsBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return { isBusy, openPicker, onFile, fileRef } as const;
};
