import { insertAccountsSchema } from '@/schemas/accounts';

export const accountFormSchema = insertAccountsSchema.pick({
  name: true,
});