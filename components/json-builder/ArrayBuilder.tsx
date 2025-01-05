'use client';

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ObjectBuilder } from "./ObjectBuilder";
import { StringField } from "./StringField";
import { Field, ObjectField } from "@/lib/json-builder/types";

interface ArrayBuilderProps {
  name: string;
  value: any[];
  itemType: Field;
  onChange: (value: any[]) => void;
}

export function ArrayBuilder({ name, value = [], itemType, onChange }: ArrayBuilderProps) {
  const handleAdd = () => {
    const newItem = itemType.type === 'object' ? {} : itemType.type === 'string' ? '' : 0;
    onChange([...value, newItem]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, newValue: any) => {
    const newArray = [...value];
    newArray[index] = newValue;
    onChange(newArray);
  };

  const renderArrayItem = (item: any, index: number) => {
    return (
      <Card key={index} className="p-4">
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {itemType.type === 'object' ? (
          <ObjectBuilder
            fields={(itemType as ObjectField).fields}
            value={item}
            onChange={(newValue) => handleItemChange(index, newValue)}
          />
        ) : (
          <StringField
            name={`${name}[${index}]`}
            value={item}
            onChange={(newValue) => handleItemChange(index, newValue)}
          />
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{name}</Label>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      <div className="space-y-4">
        {value.map((item, index) => renderArrayItem(item, index))}
      </div>
    </div>
  );
}