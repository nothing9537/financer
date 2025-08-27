import { Card, CardContent } from '@/shared/ui/card';

import { AccountsTable } from '@/widgets/account-table';

import { AccountsHeader } from './components/accounts-header';

const AccountsPage: React.FC = () => {
  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className="border-none shadow-none">
        <AccountsHeader />
      </Card>
      <CardContent>
        <AccountsTable />
      </CardContent>
    </div>
  );
};

export default AccountsPage;