'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StringFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  variant?: 'default' | 'ghost';
}

export function StringField({ 
  name, 
  value, 
  onChange, 
  onBlur,
  variant = 'default' 
}: StringFieldProps) {
  return (
    <Card className={cn(
      "transition-all",
      variant === 'default' && "p-4 border-l-4 border-l-primary/30 hover:border-l-primary",
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
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(
            "transition-all",
            variant === 'default' && "bg-background hover:border-primary focus:border-primary",
            variant === 'ghost' && "bg-muted/50 hover:bg-muted focus:bg-muted"
          )}
        />
      </div>
    </Card>
  );
}