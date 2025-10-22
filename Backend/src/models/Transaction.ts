import mongoose, { Document, Schema } from 'mongoose'

export interface ITransaction extends Document {
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
  createdAt: Date
  updatedAt: Date
}

const TokenSchema = new Schema({
  address: { type: String, required: true },
  symbol: { type: String, required: true },
  amount: { type: String, required: true },
  decimals: { type: Number, required: true }
}, { _id: false })

const TransactionSchema = new Schema({
  hash: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  from: { 
    type: String, 
    required: true,
    index: true 
  },
  to: { 
    type: String, 
    required: true,
    index: true 
  },
  value: { 
    type: String, 
    required: true 
  },
  gasUsed: { 
    type: String, 
    required: true 
  },
  gasPrice: { 
    type: String, 
    required: true 
  },
  blockNumber: { 
    type: Number, 
    required: true,
    index: true 
  },
  blockHash: { 
    type: String, 
    required: true 
  },
  transactionIndex: { 
    type: Number, 
    required: true 
  },
  timestamp: { 
    type: Number, 
    required: true,
    index: true 
  },
  chainId: { 
    type: Number, 
    required: true,
    index: true 
  },
  type: { 
    type: String, 
    required: true,
    index: true 
  },
  narration: { 
    type: String, 
    required: true 
  },
  protocol: { 
    type: String, 
    required: true,
    index: true 
  },
  method: { 
    type: String, 
    required: true 
  },
  tokens: [TokenSchema],
  metadata: {
    category: { 
      type: String, 
      required: true,
      index: true 
    },
    riskLevel: { 
      type: String, 
      enum: ['low', 'medium', 'high'],
      required: true 
    },
    gasEfficiency: { 
      type: String, 
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true 
    },
    tags: [String]
  }
}, {
  timestamps: true
})

// Indexes for better query performance
TransactionSchema.index({ from: 1, timestamp: -1 })
TransactionSchema.index({ to: 1, timestamp: -1 })
TransactionSchema.index({ type: 1, timestamp: -1 })
TransactionSchema.index({ protocol: 1, timestamp: -1 })
TransactionSchema.index({ 'metadata.category': 1, timestamp: -1 })

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema)
