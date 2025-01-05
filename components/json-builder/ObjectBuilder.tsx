'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { StringField } from './StringField';
import { NumberField } from './NumberField';
import { BooleanField } from './BooleanField';
import { EnumField } from './EnumField';
import { UnionField } from './UnionField';
import { Card } from '@/components/ui/card';
import { ArrayBuilder } from './ArrayBuilder';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface ObjectBuilderProps {
  fields?: any[];
  value: any;
  onChange: (value: any) => void;
  isRecord?: boolean;
  level?: number;
}

interface EditingKey {
  id: string;
  value: string;
  originalKey: string;
}

export function ObjectBuilder({ 
  fields = [], 
  value = {}, 
  onChange, 
  isRecord,
  level = 0 
}: ObjectBuilderProps) {
  const [editingKey, setEditingKey] = useState<EditingKey | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const handleAddRecord = () => {
    const newKey = `key_${Object.keys(value).length + 1}`;
    onChange({ 
      ...value, 
      [newKey]: { 
        order: Object.keys(value).length,
        value: {} 
      }
    });
  };

  const handleFieldChange = (name: string, fieldValue: any) => {
    onChange({ ...value, [name]: fieldValue });
  };

  const toggleCollapse = (key: string) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleKeyChange = (key: string, newValue: string) => {
    setEditingKey({
      id: key,
      value: newValue,
      originalKey: key
    });
  };

  const handleKeyBlur = (key: string, recordValue: any, fieldName?: string) => {
    if (!editingKey || editingKey.id !== key) return;

    if (editingKey.value !== editingKey.originalKey) {
      if (fieldName) {
        const newValue = { ...value[fieldName] };
        const order = newValue[key].order;
        delete newValue[editingKey.originalKey];
        newValue[editingKey.value] = {
          order,
          value: recordValue
        };
        handleFieldChange(fieldName, newValue);
      } else {
        const newValue = { ...value };
        const order = newValue[key].order;
        delete newValue[editingKey.originalKey];
        newValue[editingKey.value] = {
          order,
          value: recordValue
        };
        onChange(newValue);
      }
    }
    setEditingKey(null);
  };

  const renderRecordField = (field: any) => {
    return (
      <div className="space-y-3">
        {Object.entries(value[field.name] || {})
          .sort((a, b) => a[1].order - b[1].order)
          .map(([key, record], index) => {
            const recordValue = record.value;
            return (
              <Card 
                key={key} 
                className={cn(
                  "relative overflow-hidden transition-all",
                  "border-l-4 border-l-primary/30",
                  "hover:shadow-sm hover:border-l-primary/60"
                )}
              >
                <div className="p-3 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <StringField
                        name={key || `Key ${index + 1}`}
                        value={editingKey?.id === key ? editingKey.value : key}
                        onChange={(newValue) => handleKeyChange(key, newValue)}
                        onBlur={() => handleKeyBlur(key, recordValue, field.name)}
                        variant="ghost"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newValue = { ...value[field.name] };
                        delete newValue[key];
                        handleFieldChange(field.name, newValue);
                      }}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div 
                  className="flex items-center gap-2 px-3 py-2 border-t border-border/50 bg-muted/20 cursor-pointer" 
                  onClick={() => toggleCollapse(key)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto hover:bg-transparent"
                  >
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 transition-transform text-primary",
                        collapsed[key] && "-rotate-90"
                      )}
                    />
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    Content
                  </span>
                </div>
                {!collapsed[key] && (
                  <div className="p-4 pt-2 border-t border-border/50">
                    <ObjectBuilder
                      fields={field.itemType.fields}
                      value={recordValue}
                      onChange={(newValue) => {
                        handleFieldChange(field.name, {
                          ...value[field.name],
                          [key]: newValue
                        });
                      }}
                      level={level + 1}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        <Button
          variant="outline"
          onClick={() => {
            const newKey = `key_${Object.keys(value[field.name] || {}).length + 1}`;
            handleFieldChange(field.name, {
              ...value[field.name],
              [newKey]: {
                order: Object.keys(value[field.name] || {}).length,
                value: {}
              }
            });
          }}
          className="w-full border-dashed hover:border-solid transition-all hover:border-primary hover:text-primary"
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
      <div className="space-y-3">
        {Object.entries(value)
          .sort((a, b) => a[1].order - b[1].order)
          .map(([key, record], index) => {
            const recordValue = record.value;
            return (
              <Card 
                key={key} 
                className={cn(
                  "relative overflow-hidden transition-all",
                  "border-l-4",
                  level === 0 
                    ? "border-l-primary shadow-sm" 
                    : "border-l-primary/40"
                )}
              >
                <div className="p-3 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <StringField
                        name={key || `Key ${index + 1}`}
                        value={editingKey?.id === key ? editingKey.value : key}
                        onChange={(newValue) => handleKeyChange(key, newValue)}
                        onBlur={() => handleKeyBlur(key, recordValue)}
                        variant="ghost"
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
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div 
                  className="flex items-center gap-2 px-3 py-2 border-t border-border/50 bg-muted/20 cursor-pointer" 
                  onClick={() => toggleCollapse(key)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto hover:bg-transparent"
                  >
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 transition-transform text-primary",
                        collapsed[key] && "-rotate-90"
                      )}
                    />
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    Content
                  </span>
                </div>
                {!collapsed[key] && (
                  <div className="p-4 pt-2 border-t border-border/50">
                    <ObjectBuilder
                      fields={fields[0].itemType.fields}
                      value={recordValue}
                      onChange={(newValue) => {
                        onChange({
                          ...value,
                          [key]: newValue
                        });
                      }}
                      level={level + 1}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        <Button
          variant="outline"
          onClick={handleAddRecord}
          className="w-full border-dashed hover:border-solid transition-all hover:border-primary hover:text-primary"
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

        const fieldComponent = (() => {
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
                <div key={name} className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">{name}</h3>
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
        })();

        return (
          <div key={name} className="group">
            {fieldComponent}
          </div>
        );
      })}
    </div>
  );
}