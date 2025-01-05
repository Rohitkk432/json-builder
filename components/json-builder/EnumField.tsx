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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface EnumFieldProps {
  name: string;
  value: string | undefined;
  enumValues: string[];
  onChange: (value: string | undefined) => void;
  variant?: 'default' | 'ghost';
  isOptional?: boolean;
  onDelete?: () => void;
}

export function EnumField({ 
  name, 
  value, 
  enumValues, 
  onChange,
  variant = 'default',
  isOptional,
  onDelete
}: EnumFieldProps) {
  return (
    <Card className={cn(
      "transition-all",
      variant === 'default' && "p-4 border-l-4 border-l-violet-500/30 hover:border-l-violet-500",
      variant === 'ghost' && "bg-transparent border-none shadow-none"
    )}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label 
            htmlFor={name}
            className="text-sm font-medium text-muted-foreground"
          >
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
                className="font-medium"
              >
                {enumValue}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}