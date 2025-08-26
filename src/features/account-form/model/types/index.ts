import z from 'zod';

import { accountFormSchema } from '../../lib/consts/account-form-schema';

export type AccountFormSchemaType = z.infer<typeof accountFormSchema>;

export interface AccountFormProps {
  id?: string;
  defaultValues?: AccountFormSchemaType;
  onSubmit: (data: AccountFormSchemaType) => void;
  onDelete?: () => void;
  disabled?: boolean;
}