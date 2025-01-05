'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { StringField } from './StringField';
import { NumberField } from './NumberField';
import { BooleanField } from './BooleanField';
import { EnumField } from './EnumField';
import { UnionField } from './UnionField';
import { Card } from '@/components/ui/card';
import { ArrayBuilder } from './ArrayBuilder';

interface ObjectBuilderProps {
  fields?: any[];
  value: any;
  onChange: (value: any) => void;
  isRecord?: boolean;
}

export function ObjectBuilder({ fields = [], value = {}, onChange, isRecord }: ObjectBuilderProps) {
  const [editingKey, setEditingKey] = useState<{ original: string; current: string } | null>(null);

  const handleAddRecord = () => {
    const newKey = `key_${Object.keys(value).length + 1}`;
    onChange({ ...value, [newKey]: {} });
  };

  const handleFieldChange = (name: string, fieldValue: any) => {
    onChange({ ...value, [name]: fieldValue });
  };

  const renderRecordField = (field: any) => {
    return (
      <div className="space-y-4">
        {Object.entries(value[field.name] || {}).map(([key, recordValue]) => (
          <Card key={key} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <StringField
                    name="Key"
                    value={key}
                    onChange={(newKey) => {
                      if (newKey !== key) {
                        const newValue = { ...value[field.name] };
                        delete newValue[key];
                        newValue[newKey] = recordValue;
                        handleFieldChange(field.name, newValue);
                      }
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newValue = { ...value[field.name] };
                    delete newValue[key];
                    handleFieldChange(field.name, newValue);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <ObjectBuilder
                fields={field.itemType.fields}
                value={recordValue}
                onChange={(newValue) => {
                  handleFieldChange(field.name, {
                    ...value[field.name],
                    [key]: newValue
                  });
                }}
              />
            </div>
          </Card>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            const newKey = `key_${Object.keys(value[field.name] || {}).length + 1}`;
            handleFieldChange(field.name, {
              ...value[field.name],
              [newKey]: {}
            });
          }}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
    );
  };

  // If this is a direct array type
  if (fields.length === 1 && fields[0].type === 'array' && !fields[0].name) {
    return (
      <ArrayBuilder
        name=""
        value={Array.isArray(value) ? value : []}
        itemType={fields[0].itemType}
        onChange={onChange}
      />
    );
  }

  // If this is a direct interface type
  if (fields.length === 1 && fields[0].type === 'object' && !fields[0].name) {
    return (
      <ObjectBuilder
        fields={fields[0].fields}
        value={value}
        onChange={onChange}
      />
    );
  }

  // If this is a direct Record type
  if (fields.length === 1 && fields[0].type === 'record' && !fields[0].name) {
    return (
      <div className="space-y-4">
        {Object.entries(value).map(([key, recordValue]) => (
          <Card key={key} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <StringField
                    name="Key"
                    value={key}
                    onChange={(newKey) => {
                      if (newKey !== key) {
                        const newValue = { ...value };
                        delete newValue[key];
                        newValue[newKey] = recordValue;
                        onChange(newValue);
                      }
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newValue = { ...value };
                    delete newValue[key];
                    onChange(newValue);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <ObjectBuilder
                fields={fields[0].itemType.fields}
                value={recordValue}
                onChange={(newValue) => {
                  onChange({
                    ...value,
                    [key]: newValue
                  });
                }}
              />
            </div>
          </Card>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            const newKey = `key_${Object.keys(value).length + 1}`;
            onChange({
              ...value,
              [newKey]: {}
            });
          }}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
    );
  }

  // Regular object rendering
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const { name, type, enumValues, unionTypes, itemType } = field;

        switch (type) {
          case 'string':
            return (
              <StringField
                key={name}
                name={name}
                value={value[name] || ''}
                onChange={(newValue) => handleFieldChange(name, newValue)}
              />
            );
          case 'number':
            return (
              <NumberField
                key={name}
                name={name}
                value={value[name] || 0}
                onChange={(newValue) => handleFieldChange(name, newValue)}
              />
            );
          case 'boolean':
            return (
              <BooleanField
                key={name}
                name={name}
                value={value[name] || false}
                onChange={(newValue) => handleFieldChange(name, newValue)}
              />
            );
          case 'enum':
            return (
              <EnumField
                key={name}
                name={name}
                value={value[name] || enumValues[0]}
                enumValues={enumValues}
                onChange={(newValue) => handleFieldChange(name, newValue)}
              />
            );
          case 'array':
            return (
              <ArrayBuilder
                key={name}
                name={name}
                value={value[name] || []}
                itemType={itemType}
                onChange={(newValue) => handleFieldChange(name, newValue)}
              />
            );
          case 'record':
            return (
              <div key={name}>
                <h3 className="font-medium mb-2">{name}</h3>
                {renderRecordField(field)}
              </div>
            );
          case 'union':
            return (
              <UnionField
                key={name}
                name={name}
                value={value[name] || ''}
                types={unionTypes}
                onChange={(newValue) => handleFieldChange(name, newValue)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}