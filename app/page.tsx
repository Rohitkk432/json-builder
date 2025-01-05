import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileJson } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto py-16">
      <Card className="p-8 max-w-2xl mx-auto text-center">
        <FileJson className="w-16 h-16 mx-auto mb-6 text-primary" />
        <h1 className="text-3xl font-bold mb-4">JSON Builder</h1>
        <p className="text-muted-foreground mb-8">
          A visual tool to build and edit JSON structures
        </p>
        <Link href="/json-builder">
          <Button size="lg">
            Start Building
          </Button>
        </Link>
      </Card>
    </div>
  );
}