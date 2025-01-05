'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { parseTypeDefinitions } from '@/lib/json-builder/parser';
import { useToast } from '@/hooks/use-toast';

interface TypeDefinitionEditorProps {
  onTypesParsed: (fields: any[]) => void;
  initialTypes: string;
}

export function TypeDefinitionEditor({ onTypesParsed, initialTypes }: TypeDefinitionEditorProps) {
  const [typeDefinitions, setTypeDefinitions] = useState(initialTypes);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Add a small delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const fields = parseTypeDefinitions(typeDefinitions);
      onTypesParsed(fields);
      
      // Find and click the builder tab
      const builderTab = document.querySelector('[value="builder"]') as HTMLElement;
      if (builderTab) {
        builderTab.click();
      }

      toast({
        title: "Success",
        description: "Type definitions have been converted to JSON builder.",
      });
    } catch (error) {
      console.error('Failed to parse type definitions:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to parse type definitions",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
      <Button 
        onClick={handleGenerate} 
        className="w-full"
        disabled={isGenerating}
      >
        {isGenerating ? "Generating..." : "Generate JSON Builder"}
      </Button>
    </Card>
  );
}