import { Card, CardContent } from '@/shared/ui/card';

import { TransactionsPageHeader } from './components/categories-header';
import { TransactionsTable } from '@/widgets/transactions-table';

const TransactionsPage: React.FC = () => {
  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className="border-none drop-shadow-sm w-full h-fit">
        <TransactionsPageHeader />
        <CardContent>
          <TransactionsTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;