'use client';

import { Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ObjectBuilder } from "./ObjectBuilder";
import { StringField } from "./StringField";
import { Field } from "@/lib/json-builder/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface ArrayBuilderProps {
  name: string;
  value: any[] | undefined;
  itemType: Field;
  onChange: (value: any[] | undefined) => void;
  isOptional?: boolean;
  onDelete?: () => void;
}

const getDefaultValueForField = (field: Field): any => {
  switch (field.type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'object':
      if (!field.fields) return {};
      const defaultObj: any = {};
      field.fields.forEach(f => {
        if (!f.optional) {
          defaultObj[f.name] = getDefaultValueForField(f);
        }
      });
      return defaultObj;
    case 'array':
      return [];
    case 'enum':
      return field.enumValues?.[0] || '';
    case 'record':
      return {};
    default:
      return null;
  }
};

export function ArrayBuilder({ 
  name, 
  value = [], 
  itemType, 
  onChange,
  isOptional,
  onDelete 
}: ArrayBuilderProps) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const handleAdd = () => {
    const defaultValue = getDefaultValueForField(itemType);
    onChange([...value, defaultValue]);
  };

  const handleRemove = (index: number) => {
    const newArray = [...value];
    newArray.splice(index, 1);
    onChange(newArray);
  };

  const handleItemChange = (index: number, newValue: any) => {
    const newArray = [...value];
    newArray[index] = newValue;
    onChange(newArray);
  };

  const toggleCollapse = (index: number) => {
    setCollapsed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Card className="p-4 border-l-4 border-l-orange-500/30 hover:border-l-orange-500">
      <div className="space-y-4">
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-secondary-foreground">{name}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="border-dashed hover:border-solid transition-all hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        <div className="space-y-3">
          {value.map((item, index) => (
            <Card 
              key={index}
              className={cn(
                "relative overflow-hidden transition-all",
                "border-l-4 border-l-secondary-foreground/30",
                "hover:shadow-sm hover:border-l-secondary-foreground/60"
              )}
            >
              <div className="flex items-center gap-2 p-3 bg-muted/30" onClick={() => toggleCollapse(index)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto hover:bg-transparent"
                >
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform text-secondary-foreground",
                      collapsed[index] && "-rotate-90"
                    )}
                  />
                </Button>
                <span  className="text-sm font-medium text-secondary-foreground">
                  Item {index + 1}
                </span>
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {!collapsed[index] && (
                <div className="p-4 pt-2">
                  {itemType.type === 'object' ? (
                    <ObjectBuilder
                      fields={itemType.fields}
                      value={item}
                      onChange={(newValue) => handleItemChange(index, newValue)}
                    />
                  ) : (
                    <StringField
                      name={`${name} ${index + 1}`}
                      value={item}
                      onChange={(newValue) => handleItemChange(index, newValue)}
                      variant="ghost"
                    />
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}