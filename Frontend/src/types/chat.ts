export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: number
  transactionId?: string
  isTyping?: boolean
}

export interface ChatContext {
  transactions: string[]
  currentTransaction?: string
  userPreferences?: {
    detailLevel: 'simple' | 'detailed' | 'expert'
    language: string
  }
}

export interface ChatbotState {
  messages: ChatMessage[]
  isOpen: boolean
  isTyping: boolean
  context: ChatContext
}
