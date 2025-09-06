'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// грузим клиентскую кнопку Clerk только на клиенте
const ClientUserButton = dynamic(
  () => import('@clerk/nextjs').then(m => m.UserButton),
  { ssr: false, loading: () => <Loader2 className="animate-spin size-5 text-slate-400" /> }
);

export const UserButton: React.FC = () => {
  return <ClientUserButton /* appearance, afterSignOutUrl и т.п. */ />;
};