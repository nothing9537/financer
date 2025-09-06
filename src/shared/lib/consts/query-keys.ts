/* eslint-disable @typescript-eslint/no-explicit-any */

export const ACCOUNTS_QUERY_KEY = ['accounts'] as const;
export const ACCOUNT_QUERY_KEY = (accountId?: string) => ['accounts', { id: accountId }];

export const CATEGORIES_QUERY_KEY = ['categories'] as const;
export const CATEGORY_QUERY_KEY = (categoryId?: string) => ['categories', { id: categoryId }];

export const TRANSACTIONS_QUERY_KEY = ['transactions'] as const;
export const TRANSACTION_QUERY_KEY = (params?: Record<string, any>) => ['transactions', params];
export const TRANSACTIONS_QUERY_KEYS = (params?: Record<string, any>) => ['transactions', params];

export const SUMMARY_QUERY_KEY = ['summary'] as const;
export const SUMMARY_QUERY_KEYS = (params: Record<string, any>) => ['summary', params];