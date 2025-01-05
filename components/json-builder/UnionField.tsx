'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ObjectBuilder } from "./ObjectBuilder";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface UnionFieldProps {
  name: string;
  value: any;
  types: Array<{
    type: string;
    fields?: any[];
  }>;
  onChange: (value: any) => void;
  isOptional?: boolean;
  onDelete?: () => void;
}

export function UnionField({ 
  name, 
  value, 
  types, 
  onChange,
  isOptional,
  onDelete 
}: UnionFieldProps) {
  const currentType = typeof value === 'object' ? 'object' : typeof value;

  const handleTypeChange = (newType: string) => {
    const typeConfig = types.find(t => t.type === newType);
    
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
    <Card className="p-4 border-l-4 border-l-muted">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">
              {name} {isOptional && <span className="text-xs text-muted-foreground">(optional)</span>}
            </Label>
            {isOptional && value !== undefined && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onChange(undefined);
                  onDelete?.();
                }}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Select value={currentType} onValueChange={handleTypeChange}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem 
                  key={type.type} 
                  value={type.type}
                  className="capitalize"
                >
                  {type.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedType?.type === 'object' && selectedType.fields && (
          <div className="pl-4 border-l border-muted">
            <ObjectBuilder
              fields={selectedType.fields}
              value={value}
              onChange={onChange}
            />
          </div>
        )}
      </div>
    </Card>
  );
} 