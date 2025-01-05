export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'record' | 'enum';

export interface BaseField {
  name: string;
  type: FieldType;
  value: any;
  isOptional?: boolean;
  enumValues?: string[];
}

export interface SimpleField extends BaseField {
  type: 'string' | 'number' | 'boolean' | 'enum';
}

export interface ObjectField extends BaseField {
  type: 'object';
  fields: Field[];
}

export interface ArrayField extends BaseField {
  type: 'array';
  itemType: Field;
}

export interface RecordField extends BaseField {
  type: 'record';
  itemType: ObjectField;
}

export type Field = SimpleField | ObjectField | ArrayField | RecordField;