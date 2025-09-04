import { Loader, Upload } from 'lucide-react';

import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui/button'

import { useExportCSVTransactions } from '../hooks/use-export-csv-transactions';

interface ExportCSVTransactionButtonProps {
  className?: string;
  successAction?: () => void;
  errorAction?: () => void;
}

export const ExportCSVTransactionButton: React.FC<ExportCSVTransactionButtonProps> = ({ className, successAction, errorAction }) => {
  const [handleExport, mutation, data] = useExportCSVTransactions(successAction, errorAction);

  const buttonContent = mutation.isPending ? <Loader className='size-4 animate-spin' /> : (
    <>
      <Upload />
      Export imported transactions
    </>
  );

  return (
    <Button className={cn('ml-auto flex', className)} disabled={data.length <= 0} variant='outline' onClick={handleExport}>
      {buttonContent}
    </Button>
  )
}