import { FC } from 'react';
import { Header } from '@/widgets/header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className='px-3 lg:px-14'>
        {children}
      </main>
    </>
  )
}

export default DashboardLayout;