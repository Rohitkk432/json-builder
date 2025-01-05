'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StringField } from './StringField';
import { NumberField } from './NumberField';
import { BooleanField } from './BooleanField';
import { ArrayBuilder } from './ArrayBuilder';
import { Field, ObjectField, ArrayField, RecordField } from '@/lib/json-builder/types';

interface ObjectBuilderProps {
  fields: Field[];
  value: any;
  onChange: (value: any) => void;
}

export function ObjectBuilder({ fields, value = {}, onChange }: ObjectBuilderProps) {
  const [editingKey, setEditingKey] = useState<{ original: string; current: string } | null>(null);

  const handleFieldChange = (name: string, fieldValue: any) => {
    onChange({ ...value, [name]: fieldValue });
  };

  const handleKeyBlur = (field: RecordField, originalKey: string) => {
    if (!editingKey) return;

    const newData = { ...value[field.name] };
    if (editingKey.current && editingKey.current !== originalKey) {
      delete newData[originalKey];
      newData[editingKey.current] = value[field.name][originalKey];
      handleFieldChange(field.name, newData);
    }
    setEditingKey(null);
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case 'string':
        return (
          <StringField
            key={field.name}
            name={field.name}
            value={value[field.name] || ''}
            onChange={(newValue) => handleFieldChange(field.name, newValue)}
          />
        );
      case 'number':
        return (
          <NumberField
            key={field.name}
            name={field.name}
            value={value[field.name] || 0}
            onChange={(newValue) => handleFieldChange(field.name, newValue)}
          />
        );
      case 'boolean':
        return (
          <BooleanField
            key={field.name}
            name={field.name}
            value={value[field.name] || false}
            onChange={(newValue) => handleFieldChange(field.name, newValue)}
          />
        );
      case 'array':
        const arrayField = field as ArrayField;
        return (
          <ArrayBuilder
            key={field.name}
            name={field.name}
            value={value[field.name] || []}
            itemType={arrayField.itemType}
            onChange={(newValue) => handleFieldChange(field.name, newValue)}
          />
        );
      case 'record':
        const recordField = field as RecordField;
        return (
          <Card key={field.name} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{field.name}</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const newKey = `key_${Object.keys(value[field.name] || {}).length + 1}`;
                  const defaultValue = recordField.itemType.type === 'boolean' ? false :
                                     recordField.itemType.type === 'number' ? 0 : '';
                  handleFieldChange(field.name, {
                    ...value[field.name],
                    [newKey]: recordField.itemType.type === 'object' ? {} : defaultValue
                  });
                }}
              >
                Add Entry
              </Button>
            </div>
            <div className="space-y-4">
              {Object.entries(value[field.name] || {}).map(([key, entryValue]) => (
                <Card key={key} className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <StringField
                        name="Key"
                        value={editingKey?.original === key ? editingKey.current : key}
                        onChange={(newValue) => {
                          setEditingKey({ original: key, current: newValue });
                        }}
                        onBlur={() => handleKeyBlur(recordField, key)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newData = { ...value[field.name] };
                        delete newData[key];
                        handleFieldChange(field.name, newData);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="pl-4 border-l-2">
                    {recordField.itemType.type === 'object' ? (
                      <ObjectBuilder
                        fields={recordField.itemType.fields}
                        value={entryValue}
                        onChange={(newValue) => {
                          handleFieldChange(field.name, {
                            ...value[field.name],
                            [key]: newValue
                          });
                        }}
                      />
                    ) : (
                      renderPrimitiveField(
                        recordField.itemType.type,
                        entryValue,
                        (newValue) => {
                          handleFieldChange(field.name, {
                            ...value[field.name],
                            [key]: newValue
                          });
                        }
                      )
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  const renderPrimitiveField = (type: string, value: any, onChange: (value: any) => void) => {
    switch (type) {
      case 'string':
        return (
          <StringField
            name="Value"
            value={value || ''}
            onChange={onChange}
          />
        );
      case 'number':
        return (
          <NumberField
            name="Value"
            value={value || 0}
            onChange={onChange}
          />
        );
      case 'boolean':
        return (
          <BooleanField
            name="Value"
            value={value || false}
            onChange={onChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {fields.map((field) => renderField(field))}
    </div>
  );
}