import { Field } from './types';

export const chatStateFields: Field[] = [
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

export const chatStateTypeString = `
export interface Citation {
  company_ticker: string;
  financial_quarter: string;
  chunk_text: string;
  page_number: number;
}

export interface ChatMessage {
  user_message: string;
  bot_response: string;
  company_tickers: string[];
  quarters: string[];
  citations?: Citation[];
  error?: boolean;
}

export interface Insight {
  label: string;
  insight_text: string;
}

export interface InsightResponse {
  insights: Insight[];
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  selectedCitations: Citation[];
  isGenerating: boolean;
  isEditing: boolean;
  tooltipData: Record<string, InsightResponse>;
}
`;
