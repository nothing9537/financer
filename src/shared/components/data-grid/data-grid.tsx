import { cn } from '@/shared/lib/utils/cn';

interface DataGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
};

export const DataGrid: React.FC<DataGridProps> = ({ children, className, ...rest }) => {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8', className)} {...rest}>
      {children}
    </div>
  );
};