'use client';

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface JsonPreviewProps {
  data: any;
}

function processValue(value: any): any {
  if (!value) return value;

  // If it's an array, process each item
  if (Array.isArray(value)) {
    return value.map(item => processValue(item));
  }

  // If it's an object
  if (typeof value === 'object') {
    // Check if it's a record with __order__ (has both __order__ and value properties)
    if ('__order__' in value && 'value' in value) {
      return processValue(value.value);
    }

    // Process each property of the object
    const processed: any = {};
    Object.entries(value)
      .sort((a: any, b: any) => {
        // Sort by __order__ if both entries have __order__
        if (a[1]?.__order__ !== undefined && b[1]?.__order__ !== undefined) {
          return a[1].__order__ - b[1].__order__;
        }
        return 0;
      })
      .forEach(([key, val]) => {
        processed[key] = processValue(val);
      });
    return processed;
  }

  return value;
}

export function JsonPreview({ data }: JsonPreviewProps) {
  const processedData = processValue(data);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary">Preview</h2>
      <Card className="p-6 border-l-4 border-l-primary/30 hover:border-l-primary transition-all">
        <pre className={cn(
          "bg-muted/50 p-4 rounded-lg overflow-auto max-h-[600px]",
          "text-sm font-mono",
          "shadow-inner",
          "border border-border/50"
        )}>
          {JSON.stringify(processedData, null, 2)}
        </pre>
      </Card>
    </div>
  );
}