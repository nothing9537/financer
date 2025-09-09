'use client';

import { useImportTaxonomy } from '@/entities/categories';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

const VERSION = 'v1';

export const EnsureCategoriesGate = () => {
  const { isSignedIn, userId } = useAuth();
  const taxonomyMutation = useImportTaxonomy();
  const fired = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !userId || fired.current) return;
    const key = `cats_seeded:${VERSION}:${userId}`;

    if (localStorage.getItem(key) === '1') return;

    fired.current = true;

    taxonomyMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.setItem(key, '1');
      }
    });

  }, [isSignedIn, userId, taxonomyMutation]);

  return null;
};