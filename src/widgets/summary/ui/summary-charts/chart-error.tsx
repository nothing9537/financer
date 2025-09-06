import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export const ChartError: React.FC<{ errorMessage?: string }> = ({ errorMessage }) => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className='text-xl line-clamp-1'>
          Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full flex items-center justify-center">
          {errorMessage}
        </div>
      </CardContent>
    </Card>
  );
};