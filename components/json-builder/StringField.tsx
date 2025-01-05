'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Description } from "./Description";

interface StringFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  variant?: 'default' | 'ghost';
  isOptional?: boolean;
  onDelete?: () => void;
  description?: string;
}

export function StringField({ 
  name, 
  value, 
  onChange, 
  onBlur,
  variant = 'default',
  isOptional,
  onDelete,
  description
}: StringFieldProps) {
  return (
    <Card className={cn(
      "transition-all",
      variant === 'default' && "p-4 border-l-4 border-l-primary/30 hover:border-l-primary",
      variant === 'ghost' && "bg-transparent border-none shadow-none"
    )}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label 
              htmlFor={name}
              className="text-sm font-medium text-muted-foreground"
            >
              {name} {isOptional && <span className="text-xs text-muted-foreground">(optional)</span>}
            </Label>
            {description && <Description text={description} />}
          </div>
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