import { useEffect, useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import type { PendingTransaction, ContractInfo, TransactionWarning, RiskLevel } from '../types'
import { PreTransactionModal } from './PreTransactionModal'

interface TransactionInterceptorProps {
  children: React.ReactNode
}

export const TransactionInterceptor: React.FC<TransactionInterceptorProps> = ({ children }) => {
  const { address, isConnected } = useAccount()
  const [pendingTransaction, setPendingTransaction] = useState<PendingTransaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Mock function to analyze transaction - in real implementation, this would call your backend
  const analyzeTransaction = useCallback(async (txData: any): Promise<PendingTransaction> => {
    setIsAnalyzing(true)
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock analysis results
    const mockAnalysis: PendingTransaction = {
      id: `pending_${Date.now()}`,
      to: txData.to || '0x0000000000000000000000000000000000000000',
      data: txData.data || '0x',
      value: txData.value || '0',
      gasLimit: txData.gasLimit || '21000',
      gasPrice: txData.gasPrice,
      functionSignature: 'transfer(address,uint256)',
      decodedParams: [
        {
          name: 'to',
          type: 'address',
          value: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          description: 'Recipient address'
        },
        {
          name: 'amount',
          type: 'uint256',
          value: '1000000000000000000',
          description: 'Amount to transfer (1 ETH)'
        }
      ],
      riskLevel: determineRiskLevel(txData),
      explanation: generateExplanation(txData),
      warnings: generateWarnings(txData),
      contractInfo: await getContractInfo(txData.to),
      timestamp: Date.now(),
      status: 'pending'
    }
    
    setIsAnalyzing(false)
    return mockAnalysis
  }, [])

  const determineRiskLevel = (txData: any): RiskLevel => {
    const value = parseFloat(txData.value || '0') / 1e18
    const isUnknownContract = !isKnownContract(txData.to)
    
    if (value > 10 || isUnknownContract) return 'high'
    if (value > 1) return 'medium'
    return 'low'
  }

  const generateExplanation = (txData: any): string => {
    const value = parseFloat(txData.value || '0') / 1e18
    const contractName = getContractName(txData.to)
    
    if (value > 0) {
      return `You are about to send ${value.toFixed(4)} ETH to ${contractName}. This transaction will transfer your funds to the specified address.`
    }
    
    return `You are about to interact with ${contractName}. This transaction will execute a smart contract function.`
  }

  const generateWarnings = (txData: any): TransactionWarning[] => {
    const warnings: TransactionWarning[] = []
    const value = parseFloat(txData.value || '0') / 1e18
    const isUnknownContract = !isKnownContract(txData.to)
    
    if (value > 5) {
      warnings.push({
        type: 'high_value',
        severity: 'high',
        message: `High value transaction: ${value.toFixed(4)} ETH`,
        recommendation: 'Double-check the recipient address and amount'
      })
    }
    
    if (isUnknownContract) {
      warnings.push({
        type: 'unknown_contract',
        severity: 'medium',
        message: 'Interacting with unknown contract',
        recommendation: 'Verify the contract address and function before proceeding'
      })
    }
    
    if (parseInt(txData.gasLimit || '0') > 500000) {
      warnings.push({
        type: 'gas',
        severity: 'low',
        message: 'High gas limit detected',
        recommendation: 'Consider if this gas limit is necessary'
      })
    }
    
    return warnings
  }

  const getContractName = (address: string): string => {
    const knownContracts: Record<string, string> = {
      '0xA0b86a33E6441b8c4C8C0C4C0C4C0C4C0C4C0C4C': 'Uniswap V3 Router',
      '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': 'Uniswap V2 Router',
      '0x0000000000000000000000000000000000000000': 'Zero Address'
    }
    return knownContracts[address] || 'Unknown Contract'
  }

  const isKnownContract = (address: string): boolean => {
    const knownAddresses = [
      '0xA0b86a33E6441b8c4C8C0C4C0C4C0C4C0C4C0C4C',
      '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
    ]
    return knownAddresses.includes(address)
  }

  const getContractInfo = async (address: string): Promise<ContractInfo | undefined> => {
    if (!isKnownContract(address)) return undefined
    
    return {
      address,
      name: getContractName(address),
      verified: true,
      reputation: 'trusted',
      category: 'defi',
      riskFactors: [],
      description: 'Verified DeFi protocol'
    }
  }

  // Intercept wallet transaction requests
  useEffect(() => {
    if (!isConnected || !address) return

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
