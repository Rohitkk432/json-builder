'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { parseTypeDefinitions } from '@/lib/json-builder/parser';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface TypeDefinitionEditorProps {
  onTypesParsed: (fields: any[]) => void;
}

const LOCAL_STORAGE_KEY = 'json-builder-type-definitions';

export function TypeDefinitionEditor({ onTypesParsed }: TypeDefinitionEditorProps) {
  const [typeDefinitions, setTypeDefinitions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  const lines = typeDefinitions.split('\n');
  const lineNumbers = Array.from({ length: Math.max(lines.length, 1) }, (_, i) => i + 1);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(400, textarea.scrollHeight)}px`;
    }
  }, [typeDefinitions]);

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
      await new Promise(resolve => setTimeout(resolve, 100));
      localStorage.setItem(LOCAL_STORAGE_KEY, typeDefinitions);
      
      const fields = parseTypeDefinitions(typeDefinitions);
      
      if (!fields || fields.length === 0) {
        throw new Error("No fields were generated from the type definitions");
      }
      
      onTypesParsed(fields);
      
      const builderTab = document.querySelector('[value="builder"]') as HTMLElement;
      if (builderTab) {
        builderTab.click();
      }

      toast({
        title: "Success",
        description: "Type definitions have been converted to JSON builder.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to parse type definitions:', error);
      
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
        duration: 3000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Type Definitions</h2>
      <div className="relative rounded-md border bg-muted/50">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-flex">
            {/* Line Numbers */}
            <div 
              className="sticky left-0 z-20 w-12 bg-muted/50 border-r select-none shadow-sm"
              aria-hidden="true"
            >
              <div className="text-xs text-muted-foreground/50 font-mono text-right pr-2 pt-3">
                {lineNumbers.map(num => (
                  <div key={num} className="h-6 leading-6">
                    {num}
                  </div>
                ))}
              </div>
            </div>

            {/* Editor */}
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={typeDefinitions}
                onChange={(e) => setTypeDefinitions(e.target.value)}
                placeholder="Enter your TypeScript interface definitions here..."
                className={cn(
                  "w-full min-h-[400px] py-3 pl-2 pr-8",
                  "font-mono text-sm h-6 leading-6",
                  "bg-transparent",
                  "border-0 focus-visible:ring-0",
                  "resize-none overflow-hidden",
                  "whitespace-pre",
                  "relative z-10",
                  "scrollbar scrollbar-w-2 scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30"
                )}
                spellCheck={false}
                wrap="off"
              />
            </div>
          </div>
        </div>

        {/* Horizontal Scrollbar Track Highlight */}
        <div 
          className="absolute bottom-0 left-12 right-0 h-2 bg-muted/30 pointer-events-none"
          aria-hidden="true"
        />
      </div>

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