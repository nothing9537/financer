import { Suspense } from 'react';
import { SummaryCards, SummaryCharts } from '@/widgets/summary';

const Dashboard: React.FC = () => {
  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Suspense>
        <SummaryCards />
        <SummaryCharts />
      </Suspense>
    </div>
  );
}

export default Dashboard;