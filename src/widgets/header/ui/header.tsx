import { UserButton } from '@/features/user-button';

import { Filters } from '@/features/filters';

import { HeaderLogo } from './header-logo';
import { Navigation } from './navigation';
import { WelcomeMessage } from './welcome-message';
import { Suspense } from 'react';

export const Header = () => {
  return (
    <header className='bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36'>
      <Suspense>
        <div className='max-w-screen-2xl mx-auto'>
          <div className='w-full flex items-center justify-between mb-14'>
            <div className='flex items-center lg:gap-14'>
              <HeaderLogo />
              <Navigation />
            </div>
            <UserButton />
          </div>
          <WelcomeMessage />
          <Filters />
        </div>
      </Suspense>
    </header>
  );
}