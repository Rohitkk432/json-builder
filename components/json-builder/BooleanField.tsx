'use client';

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BooleanFieldProps {
  name: string;
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
  variant?: 'default' | 'ghost';
  isOptional?: boolean;
  onDelete?: () => void;
}

export function BooleanField({ 
  name, 
  value, 
  onChange,
  variant = 'default',
  isOptional,
  onDelete
}: BooleanFieldProps) {
  return (
    <Card className={cn(
      "transition-all",
      variant === 'default' && "p-4 border-l-4 border-l-green-500/30 hover:border-l-green-500",
      variant === 'ghost' && "bg-transparent border-none shadow-none"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Label 
            htmlFor={name}
            className="text-sm font-medium text-muted-foreground"
          >
            {name} {isOptional && <span className="text-xs text-muted-foreground">(optional)</span>}
          </Label>
          <Switch
            id={name}
            checked={value ?? false}
            onCheckedChange={onChange}
            className={cn(
              "data-[state=checked]:bg-green-500",
              "transition-all hover:ring-2 hover:ring-green-500/20"
            )}
          />
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
    </Card>
  );
}