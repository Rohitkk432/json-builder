'use client';

import { useState } from 'react';
import { ObjectBuilder } from '@/components/json-builder/ObjectBuilder';
import { JsonPreview } from '@/components/json-builder/JsonPreview';
import { Header } from '@/components/json-builder/Header';
import { Card } from '@/components/ui/card';
import { Field, ObjectField, ArrayField } from '@/lib/json-builder/types';

const chatStateFields: Field[] = [
  {
    name: 'messages',
    type: 'array' as const,
    value: [],
    itemType: {
      name: 'message',
      type: 'object' as const,
      value: {},
      fields: [
        { name: 'user_message', type: 'string' as const, value: '' },
        { name: 'bot_response', type: 'string' as const, value: '' },
        { 
          name: 'company_tickers', 
          type: 'array' as const, 
          value: [], 
          itemType: { name: 'ticker', type: 'string' as const, value: '' }
        },
        { 
          name: 'quarters', 
          type: 'array' as const, 
          value: [], 
          itemType: { name: 'quarter', type: 'string' as const, value: '' }
        },
        { 
          name: 'citations',
          type: 'array' as const,
          value: [],
          isOptional: true,
          itemType: {
            name: 'citation',
            type: 'object' as const,
            value: {},
            fields: [
              { name: 'company_ticker', type: 'string' as const, value: '' },
              { name: 'financial_quarter', type: 'string' as const, value: '' },
              { name: 'chunk_text', type: 'string' as const, value: '' },
              { name: 'page_number', type: 'number' as const, value: 0 }
            ]
          }
        },
        { name: 'error', type: 'boolean' as const, value: false, isOptional: true }
      ]
    }
  },
  { name: 'isLoading', type: 'boolean' as const, value: false },
  { name: 'isGenerating', type: 'boolean' as const, value: false },
  { name: 'isEditing', type: 'boolean' as const, value: false },
  {
    name: 'selectedCitations',
    type: 'array' as const,
    value: [],
    itemType: {
      name: 'citation',
      type: 'object' as const,
      value: {},
      fields: [
        { name: 'company_ticker', type: 'string' as const, value: '' },
        { name: 'financial_quarter', type: 'string' as const, value: '' },
        { name: 'chunk_text', type: 'string' as const, value: '' },
        { name: 'page_number', type: 'number' as const, value: 0 }
      ]
    }
  },
  {
    name: 'tooltipData',
    type: 'record' as const,
    value: {},
    itemType: {
      name: 'insightResponse',
      type: 'object' as const,
      value: {},
      fields: [
        {
          name: 'insights',
          type: 'array' as const,
          value: [],
          itemType: {
            name: 'insight',
            type: 'object' as const,
            value: {},
            fields: [
              { name: 'label', type: 'string' as const, value: '' },
              { name: 'insight_text', type: 'string' as const, value: '' }
            ]
          }
        }
      ]
    }
  }
];

export default function JsonBuilderPage() {
  const [jsonData, setJsonData] = useState({});

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        <Header onCopy={handleCopyJson} />
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <ObjectBuilder
              fields={chatStateFields}
              value={jsonData}
              onChange={setJsonData}
            />
          </Card>
          <JsonPreview data={jsonData} />
        </div>
      </div>
    </div>
  );
}