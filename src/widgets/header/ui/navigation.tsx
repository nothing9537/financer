'use client';

import { FC, useState } from 'react';
import { useMedia } from 'react-use';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MenuIcon } from 'lucide-react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { withFilters } from '@/shared/lib/utils/format';
import { Button } from '@/shared/ui/button';

import { routes } from '../lib/consts/routes';
import { NavigationItem } from './navigation-item';

type NavigationProps = {
  resetOnRoutes?: string[];
  matchPrefix?: boolean;
};

export const Navigation: FC<NavigationProps> = ({
  resetOnRoutes = [],
  matchPrefix = false,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useMedia('(max-width: 1024px)', false);

  const shouldReset = (href: string) =>
    resetOnRoutes.some((r) => (matchPrefix ? href.startsWith(r) : href === r));

  const go = (href: string) => {
    const url = shouldReset(href) ? href : withFilters(href, params);
    setIsSheetOpen(false);
    router.push(url);
  };

  const onClick = (href: string) => () => go(href);

  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none
                       focus-visible:ring-offset-0 focus-visible:ring-transparent text-white transition"
          >
            <MenuIcon className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2 mt-4">
          <SheetHeader>
            <SheetTitle>Navigation menu</SheetTitle>
            <SheetDescription>Open the main navigation menu</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((route) => (
              <NavigationItem
                key={route.href}
                isActive={route.href === pathname}
                isMobile={isMobile}
                onClick={onClick(route.href)}
                {...route}
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route) => (
        <NavigationItem
          key={route.href}
          isActive={route.href === pathname}
          isMobile={isMobile}
          onClick={onClick(route.href)}
          {...route}
        />
      ))}
    </nav>
  );
};
