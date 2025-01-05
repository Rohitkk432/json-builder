'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StringField } from './StringField';
import { NumberField } from './NumberField';
import { BooleanField } from './BooleanField';
import { ObjectBuilder } from './ObjectBuilder';
import { Card } from '@/components/ui/card';

interface UnionFieldProps {
  name: string;
  value: any;
  types: Array<{
    type: string;
    fields?: any[];
    value?: any;
  }>;
  onChange: (value: any) => void;
}

export function UnionField({ name, value, types, onChange }: UnionFieldProps) {
  const [activeType, setActiveType] = useState(types[0].type);

  const handleTypeChange = (newType: string) => {
    setActiveType(newType);
    const typeConfig = types.find(t => t.type === newType);
    
    if (typeConfig.type === 'object') {
      onChange({});
    } else if (typeConfig.type === 'number') {
      onChange(Number(value) || 0);
    } else if (typeConfig.type === 'string') {
      onChange(String(value));
    } else if (typeConfig.type === 'boolean') {
      onChange(Boolean(value));
    }
  };

  return (
    <div className="space-y-2">
      <Tabs value={activeType} onValueChange={handleTypeChange}>
        <TabsList className="mb-2">
          {types.map(type => (
            <TabsTrigger key={type.type} value={type.type} className="capitalize">
              {type.type}
            </TabsTrigger>
          ))}
        </TabsList>
        {types.map(type => (
          <TabsContent key={type.type} value={type.type}>
            {type.type === 'object' ? (
              <Card className="p-4">
                <ObjectBuilder
                  fields={type.fields || []}
                  value={value}
                  onChange={onChange}
                />
              </Card>
            ) : type.type === 'string' ? (
              <StringField
                name={name}
                value={String(value)}
                onChange={onChange}
              />
            ) : type.type === 'number' ? (
              <NumberField
                name={name}
                value={Number(value) || 0}
                onChange={onChange}
              />
            ) : type.type === 'boolean' ? (
              <BooleanField
                name={name}
                value={Boolean(value)}
                onChange={onChange}
              />
            ) : null}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 