'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StringFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function StringField({ name, value, onChange, onBlur }: StringFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{name}</Label>
      <Input
        id={name}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full"
      />
    </div>
  );
}