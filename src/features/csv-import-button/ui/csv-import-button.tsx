// features/csv-import-button/ui/csv-import-button.tsx
'use client';

import * as React from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/shared/ui/button';

import type { TxShape } from '../model/types';
import { useCSVButton } from '../lib/hooks/use-csv-button';

export type CSVImportButtonProps = {
  onImport: (data: TxShape[]) => void;
  onPickerOpen?: () => void;
};

export const CSVImportButton: React.FC<CSVImportButtonProps> = (props) => {
  const { isBusy, onFile, openPicker, fileRef } = useCSVButton(props);

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
