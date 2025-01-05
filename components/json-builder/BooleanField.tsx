'use client';

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BooleanFieldProps {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function BooleanField({ name, value, onChange }: BooleanFieldProps) {
  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor={name}>{name}</Label>
      <Switch
        id={name}
        checked={value}
        onCheckedChange={onChange}
      />
    </div>
  );
}