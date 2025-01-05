'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, FileJson } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onCopy: () => void;
}

export function Header({ onCopy }: HeaderProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    onCopy();
    toast({
      title: "JSON Copied",
      description: "The JSON has been copied to your clipboard",
    });
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <FileJson className="h-6 w-6" />
          <h1 className="text-2xl font-bold">ChatState JSON Builder</h1>
        </div>
      </div>
      <Button onClick={handleCopy}>
        <Copy className="h-4 w-4 mr-2" />
        Copy JSON
      </Button>
    </div>
  );
}