import { useEffect, useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import type { PendingTransaction, ContractInfo, TransactionWarning, RiskLevel } from '../types'
import { PreTransactionModal } from './PreTransactionModal'
import { apiService, type SecurityAnalysis } from '../services/api'

interface TransactionInterceptorProps {
  children: React.ReactNode
}

export const TransactionInterceptor: React.FC<TransactionInterceptorProps> = ({ children }) => {
  const { address, isConnected } = useAccount()
  const [pendingTransaction, setPendingTransaction] = useState<PendingTransaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Real API function to analyze transaction
  const analyzeTransaction = useCallback(async (txData: any): Promise<PendingTransaction> => {
    setIsAnalyzing(true)
    
    try {
      console.log('🔍 Analyzing transaction with real API:', txData)
      // Call the real backend API
      const response = await apiService.analyzeTransaction({
        to: txData.to || '0x0000000000000000000000000000000000000000',
        data: txData.data || '0x',
        value: txData.value || '0x0',
        from: txData.from
      })
      
      console.log('📡 API Response:', response)

      if (response.success && response.data) {
        const analysis: SecurityAnalysis = response.data
        
        // Map backend response to PendingTransaction type
        const pendingTransaction: PendingTransaction = {
          id: `pending_${Date.now()}`,
          to: txData.to || '0x0000000000000000000000000000000000000000',
          data: txData.data || '0x',
          value: txData.value || '0',
          gasLimit: txData.gasLimit || analysis.decoded.gasEstimate.toString(),
          gasPrice: txData.gasPrice,
          functionSignature: analysis.decoded.functionName,
          decodedParams: [], // Would need to decode from calldata
          riskLevel: analysis.risk.level as RiskLevel,
          explanation: analysis.decoded.explanation,
          warnings: analysis.decoded.warnings.map((warning, index) => ({
            type: 'security' as const,
            severity: analysis.risk.level as 'low' | 'medium' | 'high' | 'critical',
            message: warning,
            recommendation: analysis.risk.recommendations[index] || ''
          })),
          contractInfo: {
            address: txData.to,
            name: analysis.contract.name,
            verified: analysis.contract.verified,
            reputation: analysis.contract.reputation > 80 ? 'trusted' : 
                       analysis.contract.reputation > 60 ? 'neutral' : 'risky',
            category: analysis.contract.category as 'defi' | 'nft' | 'governance' | 'staking' | 'other',
            riskFactors: [],
            description: `${analysis.contract.name} (${analysis.contract.category})`
          },
          timestamp: Date.now(),
          status: 'pending'
        }
        
        setIsAnalyzing(false)
        return pendingTransaction
      } else {
        throw new Error(response.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('❌ Transaction analysis failed:', error)
      console.log('🔄 Falling back to mock analysis...')
      
      // Fallback to mock analysis if API fails
      const mockAnalysis: PendingTransaction = {
        id: `pending_${Date.now()}`,
        to: txData.to || '0x0000000000000000000000000000000000000000',
        data: txData.data || '0x',
        value: txData.value || '0',
        gasLimit: txData.gasLimit || '21000',
        gasPrice: txData.gasPrice,
        functionSignature: 'unknown',
        decodedParams: [],
        riskLevel: 'high',
        explanation: 'Unable to analyze transaction. Please verify the contract address and function before proceeding.',
        warnings: [{
          type: 'security',
          severity: 'high',
          message: 'Analysis failed - using fallback',
          recommendation: 'Verify the contract address on Etherscan before proceeding'
        }],
        contractInfo: {
          address: txData.to,
          name: 'Unknown Contract',
          verified: false,
          reputation: 'unknown',
          category: 'other',
          riskFactors: [],
          description: 'Contract analysis unavailable'
        },
        timestamp: Date.now(),
        status: 'pending'
      }
      
      setIsAnalyzing(false)
      return mockAnalysis
    }
  }, [])

  // Helper functions for fallback analysis (kept for error handling)
  const getContractName = (address: string): string => {
    const knownContracts: Record<string, string> = {
      '0xA0b86a33E6441b8c4C8C0C4C0C4C0C4C0C4C0C4C': 'Uniswap V3 Router',
      '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': 'Uniswap V2 Router',
      '0x0000000000000000000000000000000000000000': 'Zero Address'
    }
    return knownContracts[address] || 'Unknown Contract'
  }

  // Intercept wallet transaction requests
  useEffect(() => {
    console.log('🔌 TransactionInterceptor: isConnected =', isConnected, 'address =', address)
    
    if (!isConnected || !address) {
      console.log('❌ TransactionInterceptor: Not connected, skipping setup')
      return
    }

    console.log('✅ TransactionInterceptor: Setting up transaction interception')
    const originalSendTransaction = window.ethereum?.request
    
    if (window.ethereum && originalSendTransaction) {
      const interceptTransaction = async (args: any) => {
        if (args.method === 'eth_sendTransaction') {
          const txData = args.params?.[0]
          if (txData) {
            try {
              const analysis = await analyzeTransaction(txData)
              setPendingTransaction(analysis)
              setIsModalOpen(true)
              
              // Return a promise that resolves when user approves/rejects
              return new Promise((resolve, reject) => {
                const handleApproval = () => {
                  resolve(originalSendTransaction.call(window.ethereum, args))
                  cleanup()
                }
                
                const handleRejection = () => {
                  reject(new Error('Transaction rejected by user'))
                  cleanup()
                }
                
                const cleanup = () => {
                  setPendingTransaction(null)
                  setIsModalOpen(false)
                }
                
                // Store handlers for modal callbacks
                ;(window as any).__transactionHandlers = { handleApproval, handleRejection }
              })
            } catch (error) {
              console.error('Transaction analysis failed:', error)
              // Fallback to original behavior
              return originalSendTransaction.call(window.ethereum, args)
            }
          }
        }
        
        return originalSendTransaction.call(window.ethereum, args)
      }
      
      // Override the request method
      window.ethereum.request = interceptTransaction
    }

    return () => {
      // Restore original method on cleanup
      if (window.ethereum && originalSendTransaction) {
        window.ethereum.request = originalSendTransaction
      }
    }
  }, [isConnected, address, analyzeTransaction])

  const handleApprove = useCallback((_transactionId: string) => {
    const handlers = (window as any).__transactionHandlers
    if (handlers?.handleApproval) {
      handlers.handleApproval()
    }
  }, [])

  const handleReject = useCallback((_transactionId: string) => {
    const handlers = (window as any).__transactionHandlers
    if (handlers?.handleRejection) {
      handlers.handleRejection()
    }
  }, [])

  const handleClose = useCallback(() => {
    const handlers = (window as any).__transactionHandlers
    if (handlers?.handleRejection) {
      handlers.handleRejection()
    }
  }, [])

  return (
    <>
      {children}
      
      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-white mb-2">Analyzing Transaction</h3>
            <p className="text-gray-400">Decoding calldata and assessing risks...</p>
          </div>
        </div>
      )}

      {/* Pre-Transaction Modal */}
      <PreTransactionModal
        transaction={pendingTransaction}
        isOpen={isModalOpen}
        onClose={handleClose}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  )
}
