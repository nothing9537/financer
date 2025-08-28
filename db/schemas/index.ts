import { insertAccountsSchema } from './accounts';
import { insertCategorySchema } from './categories';

export { accounts } from './accounts';
export { categories } from './categories';

export type entitySchema = typeof insertAccountsSchema | typeof insertCategorySchema;