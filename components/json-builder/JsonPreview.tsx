'use client';

import { Card } from "@/components/ui/card";

interface JsonPreviewProps {
  data: any;
}

export function JsonPreview({ data }: JsonPreviewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Preview</h2>
      <Card className="p-6">
        <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </Card>
    </div>
  );
}