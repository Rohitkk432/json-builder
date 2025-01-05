'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface EnumFieldProps {
  name: string;
  value: string;
  enumValues: string[];
  onChange: (value: string) => void;
}

export function EnumField({ name, value, enumValues, onChange }: EnumFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{name}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={name} className="w-full">
          <SelectValue placeholder={`Select ${name}`} />
        </SelectTrigger>
        <SelectContent>
          {enumValues.map((enumValue) => (
            <SelectItem key={enumValue} value={enumValue}>
              {enumValue}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}