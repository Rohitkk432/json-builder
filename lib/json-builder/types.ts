export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'record' | 'enum' | 'union';

export interface BaseField {
  name: string;
  type: FieldType;
  value: any;
  isOptional?: boolean;
  description?: string;
  enumValues?: string[];
  unionTypes?: FieldType[]; // For union types like number | string
}

export interface SimpleField extends BaseField {
  type: 'string' | 'number' | 'boolean' | 'enum' | 'union';
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
  itemType: SimpleField | ObjectField;
}

export type Field = SimpleField | ObjectField | ArrayField | RecordField;