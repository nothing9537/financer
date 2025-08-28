export const ACCOUNTS_QUERY_KEY = ['accounts'] as const;
export const ACCOUNT_QUERY_KEY = (accountId: string) => ['accounts', { id: accountId }];

export const CATEGORIES_QUERY_KEY = ['categories'] as const;
export const CATEGORY_QUERY_KEY = (categoryId: string) => ['categories', { id: categoryId }];