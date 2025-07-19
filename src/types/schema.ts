export type FieldType = 'String' | 'Number' | 'Nested' | 'Boolean' | 'Float' | 'ObjectID' | 'Array' | 'Date' | 'Email' | 'URL';

export interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
  nested?: SchemaField[];
}

export interface SchemaFormData {
  fields: SchemaField[];
}