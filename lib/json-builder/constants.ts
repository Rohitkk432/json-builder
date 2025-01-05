import { Field } from './types';

export const chatStateFields: Field[] = [
  {
    name: 'messages',
    type: 'array',
    value: [],
    itemType: {
      name: 'message',
      type: 'object',
      value: {},
      fields: [
        { name: 'user_message', type: 'string', value: '' },
        { name: 'bot_response', type: 'string', value: '' },
        { name: 'priority', type: 'enum', value: 'medium', enumValues: ['high', 'medium', 'low'] },
        { 
          name: 'company_tickers', 
          type: 'array', 
          value: [], 
          itemType: { 
            name: 'ticker',
            type: 'string', 
            value: '' 
          }
        },
        { 
          name: 'quarters', 
          type: 'array', 
          value: [], 
          itemType: { 
            name: 'quarter',
            type: 'string', 
            value: '' 
          }
        },
        { name: 'error', type: 'boolean', value: false, isOptional: true }
      ]
    }
  },
  { name: 'isLoading', type: 'boolean', value: false },
  { name: 'isGenerating', type: 'boolean', value: false },
  { name: 'isEditing', type: 'boolean', value: false },
  {
    name: 'selectedCitations',
    type: 'array',
    value: [],
    itemType: {
      name: 'citation',
      type: 'object',
      value: {},
      fields: [
        { name: 'company_ticker', type: 'string', value: '' },
        { name: 'financial_quarter', type: 'string', value: '' },
        { name: 'chunk_text', type: 'string', value: '' },
        { name: 'page_number', type: 'number', value: 0 }
      ]
    }
  }
];