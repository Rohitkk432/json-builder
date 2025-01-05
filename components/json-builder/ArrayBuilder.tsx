'use client';

import { Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ObjectBuilder } from "./ObjectBuilder";
import { StringField } from "./StringField";
import { Field } from "@/lib/json-builder/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ArrayBuilderProps {
  name: string;
  value: any[];
  itemType: Field;
  onChange: (value: any[]) => void;
}

export function ArrayBuilder({ name, value = [], itemType, onChange }: ArrayBuilderProps) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const handleAdd = () => {
    const defaultValue = 
      itemType.type === 'object' ? {} :
      itemType.type === 'string' ? '' :
      itemType.type === 'number' ? 0 :
      itemType.type === 'boolean' ? false :
      null;
    
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
    <Card className="p-4 border-l-4 border-l-secondary/50 hover:shadow-md transition-all">
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
    </Card>
  );
}