'use client';

import { Loader2 } from 'lucide-react';
import { ClerkLoaded, ClerkLoading, UserButton as ClerkUserButton } from '@clerk/nextjs';

export const UserButton: React.FC = () => {
  return (
    <>
      <ClerkLoaded>
        <ClerkUserButton />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className='animate-spin size-8 text-slate-400' />
      </ClerkLoading>
    </>
  )
}