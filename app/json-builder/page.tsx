'use client';

import { useState } from 'react';
import { ObjectBuilder } from '@/components/json-builder/ObjectBuilder';
import { JsonPreview } from '@/components/json-builder/JsonPreview';
import { Header } from '@/components/json-builder/Header';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TypeDefinitionEditor } from '@/components/json-builder/TypeDefinitionEditor';
import { parseTypeDefinitions } from '@/lib/json-builder/parser';
import { chatStateTypeString } from '@/lib/json-builder/constants';
import { Field } from '@/lib/json-builder/types';

export default function JsonBuilderPage() {
  const [activeTab, setActiveTab] = useState('types');
  const [jsonData, setJsonData] = useState({});
  const [fields, setFields] = useState<Field[]>(() => {
    try {
      return parseTypeDefinitions(chatStateTypeString);
    } catch (error) {
      console.error('Failed to parse initial type definitions:', error);
      return [];
    }
  });

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
  };

  const handleTypesParsed = (newFields: Field[]) => {
    setFields(newFields);
    setActiveTab('builder');
  };

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
                <TypeDefinitionEditor 
                  onTypesParsed={handleTypesParsed} 
                  initialTypes={chatStateTypeString}
                />
              </TabsContent>
              <TabsContent value="builder">
                <Card className="p-6">
                  <ObjectBuilder
                    fields={fields}
                    value={jsonData}
                    onChange={setJsonData}
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