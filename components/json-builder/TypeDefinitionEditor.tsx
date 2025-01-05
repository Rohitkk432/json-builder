'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { parseTypeDefinitions } from '@/lib/json-builder/parser';
import { useToast } from '@/hooks/use-toast';

interface TypeDefinitionEditorProps {
  onTypesParsed: (fields: any[]) => void;
}

const LOCAL_STORAGE_KEY = 'json-builder-type-definitions';

export function TypeDefinitionEditor({ onTypesParsed }: TypeDefinitionEditorProps) {
  const [typeDefinitions, setTypeDefinitions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Load saved type definitions from localStorage on mount
  useEffect(() => {
    const savedTypes = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTypes) {
      setTypeDefinitions(savedTypes);
    }
  }, []);

  const handleGenerate = async () => {
    if (!typeDefinitions.trim()) {
      toast({
        title: "Error",
        description: "Please enter type definitions",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Add a small delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Save to localStorage before parsing
      localStorage.setItem(LOCAL_STORAGE_KEY, typeDefinitions);
      
      const fields = parseTypeDefinitions(typeDefinitions);
      
      if (!fields || fields.length === 0) {
        throw new Error("No fields were generated from the type definitions");
      }
      
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
      
      // Provide more specific error messages
      let errorMessage = "Failed to parse type definitions";
      if (error instanceof Error) {
        if (error.message.includes("RootState")) {
          errorMessage = "RootState type/interface not found. Please define a RootState.";
        } else if (error.message.includes("Invalid type declaration")) {
          errorMessage = "Invalid type declaration format. Please check your syntax.";
        } else if (error.message.includes("Could not determine interface")) {
          errorMessage = "Could not parse interface/type declaration. Please check your syntax.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000, // Show error for longer
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