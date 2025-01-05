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