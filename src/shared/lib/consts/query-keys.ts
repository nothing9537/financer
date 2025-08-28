export const ACCOUNTS_QUERY_KEY = ['accounts'] as const;
export const ACCOUNT_QUERY_KEY = (accountId: string) => ['accounts', { id: accountId }];