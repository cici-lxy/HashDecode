import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PendingTransaction, RiskLevel } from '../types'
import { 
  X, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Clock,
  Info
} from 'lucide-react'

interface PreTransactionModalProps {
  transaction: PendingTransaction | null
  isOpen: boolean
  onClose: () => void
  onApprove: (transactionId: string) => void
  onReject: (transactionId: string) => void
}

export const PreTransactionModal: React.FC<PreTransactionModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {

  if (!transaction) return null

  const getRiskColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case 'low':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'high':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      case 'critical':
        return 'text-red-400 bg-red-400/10 border-red-400/20'
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getRiskIcon = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle className="w-5 h-5" />
      case 'medium':
        return <Info className="w-5 h-5" />
      case 'high':
        return <AlertTriangle className="w-5 h-5" />
      case 'critical':
        return <Shield className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const formatValue = (value: string) => {
    const ethValue = parseFloat(value) / 1e18
    return ethValue > 0 ? `${ethValue.toFixed(4)} ETH` : '0 ETH'
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Transaction Analysis</h2>
                  <p className="text-sm text-gray-400">Review before signing</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Risk Assessment */}
              <div className={`p-4 rounded-xl border ${getRiskColor(transaction.riskLevel)}`}>
                <div className="flex items-center space-x-3 mb-2">
                  {getRiskIcon(transaction.riskLevel)}
                  <span className="font-semibold capitalize">
                    {transaction.riskLevel} Risk
                  </span>
                </div>
                <p className="text-sm opacity-90">
                  {transaction.explanation}
                </p>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">To Contract</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-sm text-white bg-white/5 px-2 py-1 rounded">
                        {formatAddress(transaction.to)}
                      </code>
                      <button className="p-1 hover:bg-white/10 rounded">
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400">Value</label>
                    <p className="text-sm text-white mt-1">
                      {formatValue(transaction.value)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400">Gas Limit</label>
                    <p className="text-sm text-white mt-1">
                      {parseInt(transaction.gasLimit).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400">Function</label>
                    <p className="text-sm text-white mt-1 font-mono">
                      {transaction.functionSignature}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contract Information */}
              {transaction.contractInfo && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Contract Information</h3>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{transaction.contractInfo.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.contractInfo.reputation === 'trusted' ? 'bg-green-500/20 text-green-400' :
                        transaction.contractInfo.reputation === 'risky' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {transaction.contractInfo.reputation}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 capitalize">
                      {transaction.contractInfo.category} • {transaction.contractInfo.verified ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {transaction.warnings.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Warnings</h3>
                  <div className="space-y-2">
                    {transaction.warnings.map((warning, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          warning.severity === 'critical' ? 'border-red-500 bg-red-500/10' :
                          warning.severity === 'high' ? 'border-orange-500 bg-orange-500/10' :
                          warning.severity === 'medium' ? 'border-yellow-500 bg-yellow-500/10' :
                          'border-blue-500 bg-blue-500/10'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                            warning.severity === 'critical' ? 'text-red-400' :
                            warning.severity === 'high' ? 'text-orange-400' :
                            warning.severity === 'medium' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-white">{warning.message}</p>
                            {warning.recommendation && (
                              <p className="text-xs text-gray-400 mt-1">
                                💡 {warning.recommendation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decoded Parameters */}
              {transaction.decodedParams.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Parameters</h3>
                  <div className="space-y-2">
                    {transaction.decodedParams.map((param, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">{param.name}</span>
                          <span className="text-xs text-gray-400">{param.type}</span>
                        </div>
                        <p className="text-sm text-gray-300 font-mono">
                          {typeof param.value === 'object' ? JSON.stringify(param.value) : String(param.value)}
                        </p>
                        {param.description && (
                          <p className="text-xs text-gray-400 mt-1">{param.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between p-6 border-t border-white/10 bg-black/20">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Auto-expires in 5:00</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onReject(transaction.id)}
                  className="px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2 inline" />
                  Reject
                </button>
                <button
                  onClick={() => onApprove(transaction.id)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <CheckCircle className="w-4 h-4 mr-2 inline" />
                  Approve
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
