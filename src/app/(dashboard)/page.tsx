import { SummaryCards, SummaryCharts } from '@/widgets/summary';

export default function Dashboard() {
  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <SummaryCards />
      <SummaryCharts />
    </div>
  );
}
