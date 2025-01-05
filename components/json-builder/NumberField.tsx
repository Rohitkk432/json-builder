'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface NumberFieldProps {
  name: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  variant?: 'default' | 'ghost';
  isOptional?: boolean;
  onDelete?: () => void;
}

export function NumberField({ 
  name, 
  value, 
  onChange,
  variant = 'default',
  isOptional,
  onDelete
}: NumberFieldProps) {
  return (
    <Card className={cn(
      "transition-all",
      variant === 'default' && "p-4 border-l-4 border-l-blue-500/30 hover:border-l-blue-500",
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
        <Input
          id={name}
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          className={cn(
            "transition-all",
            variant === 'default' && "bg-background hover:border-blue-500 focus:border-blue-500",
            variant === 'ghost' && "bg-muted/50 hover:bg-muted focus:bg-muted"
          )}
        />
      </div>
    </Card>
  );
}