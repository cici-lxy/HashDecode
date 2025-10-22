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

// Pre-Transaction Analysis Types
export interface PendingTransaction {
  id: string
  to: string
  data: string
  value: string
  gasLimit: string
  gasPrice?: string
  functionSignature: string
  decodedParams: DecodedParameter[]
  riskLevel: RiskLevel
  explanation: string
  warnings: TransactionWarning[]
  contractInfo?: ContractInfo
  timestamp: number
  status: 'pending' | 'approved' | 'rejected' | 'expired'
}

export interface DecodedParameter {
  name: string
  type: string
  value: any
  description?: string
}

export interface TransactionWarning {
  type: 'security' | 'gas' | 'slippage' | 'unknown_contract' | 'high_value'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  recommendation?: string
}

export interface ContractInfo {
  address: string
  name: string
  verified: boolean
  reputation: 'trusted' | 'neutral' | 'risky' | 'unknown'
  category: 'defi' | 'nft' | 'governance' | 'staking' | 'other'
  riskFactors: string[]
  description?: string
}

export interface ContractTemplate {
  address: string
  name: string
  functions: ContractFunction[]
  riskLevel: RiskLevel
  category: string
  description: string
}

export interface ContractFunction {
  signature: string
  name: string
  description: string
  parameters: Parameter[]
  riskFactors: string[]
  gasEstimate?: string
}

export interface Parameter {
  name: string
  type: string
  description: string
  required: boolean
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface SecuritySettings {
  autoApproveLowRisk: boolean
  requireConfirmationForHighValue: boolean
  highValueThreshold: string
  enableWarnings: boolean
  trustedContracts: string[]
  blockedContracts: string[]
}

// Re-export chat types
export type { ChatMessage, ChatContext, ChatbotState } from './chat'
