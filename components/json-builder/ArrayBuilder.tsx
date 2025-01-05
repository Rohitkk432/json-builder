'use client';

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ObjectBuilder } from "./ObjectBuilder";
import { StringField } from "./StringField";
import { Field } from "@/lib/json-builder/types";

interface ArrayBuilderProps {
  name: string;
  value: any[];
  itemType: Field;
  onChange: (value: any[]) => void;
}

export function ArrayBuilder({ name, value = [], itemType, onChange }: ArrayBuilderProps) {
  const handleAdd = () => {
    const defaultValue = 
      itemType.type === 'object' ? {} :
      itemType.type === 'number' ? 0 :
      itemType.type === 'boolean' ? false : '';
    
    onChange([...value, defaultValue]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, newValue: any) => {
    const newArray = [...value];
    newArray[index] = newValue;
    onChange(newArray);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{name}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      <div className="space-y-2">
        <Accordion type="multiple" className="space-y-2">
          {value.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg"
            >
              <AccordionTrigger className="px-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Item {index + 1}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 pb-4 space-y-4">
                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  );
}