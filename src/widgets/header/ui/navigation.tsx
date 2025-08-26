'use client';

import { FC, useState } from 'react';
import { useMedia } from 'react-use';
import { usePathname } from 'next/navigation';
import { MenuIcon } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';

import { routes } from '../lib/consts/routes';
import { NavigationItem } from './navigation-item';

export const Navigation: FC = () => {
  const pathname = usePathname();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isMobile = useMedia('(max-width: 1024px)', false);

  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className='font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition'>
            <MenuIcon className='size-4' />
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='px-2 mt-4'>
          <nav className='flex flex-col gap-y-2 pt-6'>
            {routes.map((route) => (
              <NavigationItem
                key={route.href}
                isActive={route.href === pathname}
                isMobile={isMobile}
                onClick={() => setIsSheetOpen(false)}
                {...route}
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <nav className='hidden lg:flex items-center gap-x-2 overflow-x-auto'>
      {routes.map((route) => (
        <NavigationItem
          key={route.href}
          isActive={route.href === pathname}
          isMobile={isMobile}
          {...route}
        />
      ))}
    </nav>
  );
};