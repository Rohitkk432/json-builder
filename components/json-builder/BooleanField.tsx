'use client';

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BooleanFieldProps {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
  variant?: 'default' | 'ghost';
}

export function BooleanField({ 
  name, 
  value, 
  onChange,
  variant = 'default' 
}: BooleanFieldProps) {
  return (
    <Card className={cn(
      "transition-all",
      variant === 'default' && "p-4 border-l-4 border-l-green-500/30 hover:border-l-green-500",
      variant === 'ghost' && "bg-transparent border-none shadow-none"
    )}>
      <div className="flex items-center justify-between space-x-4">
        <Label 
          htmlFor={name}
          className="text-sm font-medium text-muted-foreground"
        >
          {name}
        </Label>
        <Switch
          id={name}
          checked={value}
          onCheckedChange={onChange}
          className={cn(
            "data-[state=checked]:bg-green-500",
            "transition-all hover:ring-2 hover:ring-green-500/20"
          )}
        />
      </div>
    </Card>
  );
}