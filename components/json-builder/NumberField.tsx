'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NumberFieldProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  variant?: 'default' | 'ghost';
}

export function NumberField({ 
  name, 
  value, 
  onChange,
  variant = 'default' 
}: NumberFieldProps) {
  return (
    <Card className={cn(
      "transition-all",
      variant === 'default' && "p-4 border-l-4 border-l-orange-500/30 hover:border-l-orange-500",
      variant === 'ghost' && "bg-transparent border-none shadow-none"
    )}>
      <div className="space-y-2">
        <Label 
          htmlFor={name}
          className="text-sm font-medium text-muted-foreground"
        >
          {name}
        </Label>
        <Input
          id={name}
          type="number"
          value={value || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "transition-all font-mono",
            variant === 'default' && "bg-background hover:border-orange-500 focus:border-orange-500",
            variant === 'ghost' && "bg-muted/50 hover:bg-muted focus:bg-muted"
          )}
        />
      </div>
    </Card>
  );
}