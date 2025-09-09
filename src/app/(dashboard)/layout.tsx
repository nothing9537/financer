import { FC } from 'react';
import { Header } from '@/widgets/header';
import { EnsureCategoriesGate } from '@/features/ensure-categories-gate';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <>
      <EnsureCategoriesGate />
      <Header />
      <main className='px-3 lg:px-14'>
        {children}
      </main>
    </>
  )
}

export default DashboardLayout;