'use client';

import { useState } from 'react';
import { ObjectBuilder } from '@/components/json-builder/ObjectBuilder';
import { JsonPreview } from '@/components/json-builder/JsonPreview';
import { Header } from '@/components/json-builder/Header';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TypeDefinitionEditor } from '@/components/json-builder/TypeDefinitionEditor';
import { Field } from '@/lib/json-builder/types';

export default function JsonBuilderPage() {
  const [activeTab, setActiveTab] = useState('types');
  const [jsonData, setJsonData] = useState({});
  const [fields, setFields] = useState<Field[]>([]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
  };

  const handleTypesParsed = (newFields: Field[]) => {
    setFields(newFields);
    setJsonData({}); // Reset JSON data when types change
    setActiveTab('builder');
  };

  // Check if we're dealing with a root Record type
  const isRootRecord = fields.length === 1 && fields[0].type === 'object';

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        <Header onCopy={handleCopyJson} />
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="types">Types</TabsTrigger>
                <TabsTrigger value="builder">Builder</TabsTrigger>
              </TabsList>
              <TabsContent value="types">
                <TypeDefinitionEditor onTypesParsed={handleTypesParsed} />
              </TabsContent>
              <TabsContent value="builder">
                <Card className="p-6">
                  <ObjectBuilder
                    fields={fields}
                    value={jsonData}
                    onChange={setJsonData}
                    isRecord={isRootRecord}
                  />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <JsonPreview data={jsonData} />
        </div>
      </div>
    </div>
  );
}