import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export const ChartLoading: React.FC = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 lg:w-32 w-full" />
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
        </div>
      </CardContent>
    </Card>
  );
};