'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberFieldProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
}

export function NumberField({ name, value, onChange }: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{name}</Label>
      <Input
        id={name}
        type="number"
        value={value || 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}