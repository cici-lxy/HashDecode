import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Transaction } from '../types'
import { formatAddress, formatTimeAgo, getTransactionTypeIcon, getTransactionTypeColor, cn } from '../lib/utils'
import { 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap
} from 'lucide-react'

interface TransactionCardProps {
  transaction: Transaction
  index: number
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, index }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'success':
        return 'border-green-400/20 bg-green-400/5'
      case 'failed':
        return 'border-red-400/20 bg-red-400/5'
      case 'pending':
        return 'border-yellow-400/20 bg-yellow-400/5'
      default:
        return 'border-gray-400/20 bg-gray-400/5'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        'relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]',
        getStatusColor()
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-teal-500/5 to-blue-500/5" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {getTransactionTypeIcon(transaction.type)}
            </div>
            <div>
              <h3 className="font-semibold text-white capitalize">
                {transaction.type}
              </h3>
              <p className="text-sm text-gray-400">
                {formatTimeAgo(transaction.timestamp)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Narration */}
        <div className="mb-4">
          <p className="text-gray-200 leading-relaxed">
            {transaction.narration}
          </p>
        </div>

        {/* Amount and Value */}
        {(transaction.amount || transaction.value) && (
          <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-white/5">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-white">
                {transaction.amount} {transaction.token}
              </span>
              {transaction.value && (
                <span className="text-sm text-gray-400">
                  ≈ ${transaction.value}
                </span>
              )}
            </div>
            <div className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              getTransactionTypeColor(transaction.type)
            )}>
              {transaction.type.toUpperCase()}
            </div>
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-4 border-t border-white/10"
          >
            {/* Transaction Hash */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Transaction Hash:</span>
              <div className="flex items-center space-x-2">
                <code className="text-xs font-mono text-gray-300">
                  {formatAddress(transaction.hash)}
                </code>
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>

            {/* From/To Addresses */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-400">From:</span>
                <p className="text-sm font-mono text-white">
                  {formatAddress(transaction.from)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-400">To:</span>
                <p className="text-sm font-mono text-white">
                  {formatAddress(transaction.to)}
                </p>
              </div>
            </div>

            {/* Gas Information */}
            {transaction.gasUsed && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Gas Used:</span>
                </span>
                <span className="text-sm text-white">
                  {parseInt(transaction.gasUsed).toLocaleString()}
                </span>
              </div>
            )}

            {/* Protocol Details */}
            {transaction.details?.protocol && (
              <div className="p-3 rounded-lg bg-white/5">
                <h4 className="text-sm font-medium text-white mb-2">Protocol Details</h4>
                <div className="space-y-1 text-xs text-gray-300">
                  {transaction.details.protocol && (
                    <p>Protocol: {transaction.details.protocol}</p>
                  )}
                  {transaction.details.pool && (
                    <p>Pool: {transaction.details.pool}</p>
                  )}
                  {transaction.details.fee && (
                    <p>Fee: {transaction.details.fee}</p>
                  )}
                  {transaction.details.slippage && (
                    <p>Slippage: {transaction.details.slippage}</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
