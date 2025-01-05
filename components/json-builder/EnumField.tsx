'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EnumFieldProps {
  name: string;
  value: string;
  enumValues: string[];
  onChange: (value: string) => void;
  variant?: 'default' | 'ghost';
}

export function EnumField({ 
  name, 
  value, 
  enumValues, 
  onChange,
  variant = 'default' 
}: EnumFieldProps) {
  return (
    <Card className={cn(
      "transition-all",
      variant === 'default' && "p-4 border-l-4 border-l-violet-500/30 hover:border-l-violet-500",
      variant === 'ghost' && "bg-transparent border-none shadow-none"
    )}>
      <div className="space-y-2">
        <Label 
          htmlFor={name}
          className="text-sm font-medium text-muted-foreground"
        >
          {name}
        </Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger 
            id={name} 
            className={cn(
              "transition-all",
              variant === 'default' && "bg-background hover:border-violet-500 focus:border-violet-500",
              variant === 'ghost' && "bg-muted/50 hover:bg-muted focus:bg-muted"
            )}
          >
            <SelectValue placeholder={`Select ${name}`} />
          </SelectTrigger>
          <SelectContent>
            {enumValues.map((enumValue) => (
              <SelectItem 
                key={enumValue} 
                value={enumValue}
                className="capitalize font-medium"
              >
                {enumValue.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}