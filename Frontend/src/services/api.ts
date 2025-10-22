const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  blockNumber: number
  blockHash: string
  transactionIndex: number
  timestamp: number
  chainId: number
  type: string
  narration: string
  protocol: string
  method: string
  tokens: Array<{
    address: string
    symbol: string
    amount: string
    decimals: number
  }>
  metadata: {
    category: string
    riskLevel: 'low' | 'medium' | 'high'
    gasEfficiency: 'excellent' | 'good' | 'fair' | 'poor'
    tags: string[]
  }
}

interface TransactionStats {
  totalTransactions: number
  totalVolume: number
  avgGasUsed: number
  protocols: string[]
  types: string[]
  categories: string[]
}

interface ChatMessage {
  message: string
  suggestions: string[]
  analysis?: any
}

interface SecurityAnalysis {
  transaction: {
    to: string
    value: string
    data: string
  }
  decoded: {
    functionName: string
    protocol: string
    explanation: string
    warnings: string[]
    gasEstimate: number
  }
  risk: {
    level: 'low' | 'medium' | 'high' | 'critical'
    factors: {
      valueRisk: number
      functionRisk: number
      contractRisk: number
      gasRisk: number
      overallScore: number
      overallRisk: string
      recommendations: string[]
    }
    score: number
    recommendations: string[]
  }
  contract: {
    name: string
    reputation: number
    verified: boolean
    category: string
  }
  timestamp: string
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  // Transaction endpoints
  async getWalletTransactions(
    address: string,
    chainId: string = '1',
    limit: number = 50,
    offset: number = 0,
    filters?: {
      type?: string
      protocol?: string
      category?: string
    }
  ): Promise<ApiResponse<Transaction[]>> {
    const params = new URLSearchParams({
      chainId,
      limit: limit.toString(),
      offset: offset.toString(),
      ...filters,
    })

    return this.request<Transaction[]>(`/transactions/wallet/${address}?${params}`)
  }

  async getTransactionByHash(hash: string): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>(`/transactions/hash/${hash}`)
  }

  async processTransaction(hash: string, chainId: string): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>('/transactions/process', {
      method: 'POST',
      body: JSON.stringify({ hash, chainId }),
    })
  }

  async getTransactionStats(
    address: string,
    chainId: string = '1',
    days: number = 30
  ): Promise<ApiResponse<TransactionStats>> {
    const params = new URLSearchParams({
      chainId,
      days: days.toString(),
    })

    return this.request<TransactionStats>(`/transactions/stats/${address}?${params}`)
  }

  // AI endpoints
  async chatWithAI(
    message: string,
    walletAddress?: string,
    context?: any
  ): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, walletAddress, context }),
    })
  }

  async analyzeTransactions(
    walletAddress: string,
    analysisType: string = 'general'
  ): Promise<ApiResponse<any>> {
    return this.request<any>('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, analysisType }),
    })
  }

  async getAISuggestions(
    walletAddress: string,
    type: string = 'general'
  ): Promise<ApiResponse<string[]>> {
    return this.request<string[]>(`/ai/suggestions/${walletAddress}?type=${type}`)
  }

  // Security Analysis
  async analyzeTransaction(txData: {
    to: string
    data: string
    value: string
    from?: string
  }): Promise<ApiResponse<SecurityAnalysis>> {
    console.log('🌐 API Service - Base URL:', API_BASE_URL)
    console.log('📤 Sending transaction data:', txData)
    return this.request<SecurityAnalysis>('/analysis/analyze', {
      method: 'POST',
      body: JSON.stringify(txData),
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request<any>('/health')
  }
}

export const apiService = new ApiService()
export type { Transaction, TransactionStats, ChatMessage, SecurityAnalysis }
