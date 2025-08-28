import { entitySchema } from '@/schemas';

export interface EntitySchema {
  name: string;
}

export interface EntityFormProps {
  id?: string;
  defaultValues?: EntitySchema;
  onSubmit: (data: EntitySchema) => void;
  onDelete?: () => void;
  disabled?: boolean;
  placeholder?: string;
  entity: 'Account' | 'Category';
  schema: entitySchema;
}