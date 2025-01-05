'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ObjectBuilder } from "./ObjectBuilder";

interface UnionFieldProps {
  name: string;
  value: any;
  types: Array<{
    type: string;
    fields?: any[];
  }>;
  onChange: (value: any) => void;
}

export function UnionField({ name, value, types, onChange }: UnionFieldProps) {
  const currentType = typeof value === 'object' ? 'object' : typeof value;

  const handleTypeChange = (newType: string) => {
    const typeConfig = types.find(t => t.type === newType);
    
    // Add null check for typeConfig
    if (!typeConfig) {
      console.error(`Type config not found for type: ${newType}`);
      return;
    }

    if (typeConfig.type === 'object') {
      onChange({});
    } else if (typeConfig.type === 'number') {
      onChange(Number(value) || 0);
    } else if (typeConfig.type === 'boolean') {
      onChange(Boolean(value));
    } else {
      onChange('');
    }
  };

  const selectedType = types.find(t => t.type === currentType);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">{name}</label>
        <Select value={currentType} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {types.map((type) => (
              <SelectItem key={type.type} value={type.type}>
                {type.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedType?.type === 'object' && selectedType.fields && (
        <ObjectBuilder
          fields={selectedType.fields}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
} 