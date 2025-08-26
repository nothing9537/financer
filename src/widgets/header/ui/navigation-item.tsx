import { FC } from 'react';
import Link from 'next/link';

import { Button, ButtonProps } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils/cn';

import { NavigationRoute } from '../model/types/route';

type NavigationItemType = NavigationRoute & ButtonProps;

interface NavigationItemProps extends NavigationItemType {
  isActive: boolean;
  isMobile: boolean;
}

export const NavigationItem: FC<NavigationItemProps> = ({ label, href, isActive, isMobile, ...rest }) => {
  if (isMobile) {
    return (
      <Button asChild variant={isActive ? "secondary" : "ghost"} {...rest} className='w-full justify-start'>
        <Link href={href}>
          {label}
        </Link>
      </Button>
    )
  }

  return (
    <Button asChild size="sm" variant="outline" className={cn("w-full lg:w-auto justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition", isActive ? "bg-white/10 text-white" : "bg-transparent")} {...rest}>
      <Link href={href}>
        {label}
      </Link>
    </Button>
  )
}