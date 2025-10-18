export interface Transaction {
  id: string
  hash: string
  type: TransactionType
  from: string
  to: string
  amount?: string
  token?: string
  value?: string
  gasUsed?: string
  gasPrice?: string
  timestamp: number
  status: 'pending' | 'success' | 'failed'
  narration: string
  details?: TransactionDetails
}

export type TransactionType = 
  | 'swap'
  | 'mint'
  | 'transfer'
  | 'stake'
  | 'unstake'
  | 'vote'
  | 'claim'
  | 'burn'
  | 'approve'
  | 'deposit'
  | 'withdraw'

export interface TransactionDetails {
  protocol?: string
  pool?: string
  fee?: string
  slippage?: string
  route?: string[]
  nftId?: string
  collection?: string
  proposalId?: string
  votes?: string
  stakingPool?: string
  reward?: string
}

export interface Wallet {
  address: string
  balance: string
  ens?: string
  avatar?: string
}

export interface NarrationSettings {
  language: string
  detailLevel: 'simple' | 'detailed' | 'expert'
  showGas: boolean
  showTechnicalDetails: boolean
  aiEnabled: boolean
}

export interface DashboardStats {
  totalTransactions: number
  totalVolume: string
  activeProtocols: number
  gasSpent: string
}

// Re-export chat types
export type { ChatMessage, ChatContext, ChatbotState } from './chat'
