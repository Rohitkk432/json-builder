'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, FileJson } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface HeaderProps {
  onCopy: () => void;
}

export function Header({ onCopy }: HeaderProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    onCopy();
    setTimeout(() => {
      toast({
        title: "Copied",
        description: "JSON has been copied to clipboard",
        duration: 3000,
      });
    }, 100);
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <FileJson className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            JSON Builder
          </h1>
        </div>
      </div>
      <Button 
        onClick={handleCopy}
        className="bg-primary hover:bg-primary/90 transition-colors"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy JSON
      </Button>
    </div>
  );
}