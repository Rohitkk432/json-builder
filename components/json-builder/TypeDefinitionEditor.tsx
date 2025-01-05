'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { parseTypeDefinitions } from '@/lib/json-builder/parser';

interface TypeDefinitionEditorProps {
  onTypesParsed: (fields: any[]) => void;
  initialTypes: string;
}

export function TypeDefinitionEditor({ onTypesParsed, initialTypes }: TypeDefinitionEditorProps) {
  const [typeDefinitions, setTypeDefinitions] = useState(initialTypes);

  const handleGenerate = () => {
    try {
      const fields = parseTypeDefinitions(typeDefinitions);
      onTypesParsed(fields);
    } catch (error) {
      console.error('Failed to parse type definitions:', error);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Type Definitions</h2>
      <Textarea
        value={typeDefinitions}
        onChange={(e) => setTypeDefinitions(e.target.value)}
        className="font-mono h-[400px]"
        placeholder="Paste your TypeScript interfaces here..."
      />
      <Button onClick={handleGenerate} className="w-full">
        Generate JSON Builder
      </Button>
    </Card>
  );
}