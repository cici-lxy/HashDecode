import { ethers } from 'ethers'

export interface DecodedTransaction {
  functionName: string
  contractAddress: string
  protocol: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  explanation: string
  warnings: string[]
  gasEstimate: number
  parameters?: any
}

export class TransactionDecoder {
  private functionSignatures: Map<string, any> = new Map()

  constructor() {
    this.initializeFunctionSignatures()
  }

  async decodeTransaction(txData: {
    to: string
    data: string
    value: string
    from?: string
  }): Promise<DecodedTransaction> {
    try {
      // Extract function signature (first 4 bytes)
      const functionSignature = txData.data.slice(0, 10)
      
      // Decode based on function signature
      const decoded = this.decodeBySignature(functionSignature, txData)
      
      // Assess risk
      const riskLevel = this.assessRisk(decoded, txData)
      
      // Generate explanation
      const explanation = this.generateExplanation(decoded, txData)
      
      // Generate warnings
      const warnings = this.generateWarnings(decoded, riskLevel, txData)
      
      return {
        functionName: decoded.functionName,
        contractAddress: txData.to,
        protocol: decoded.protocol,
        riskLevel,
        explanation,
        warnings,
        gasEstimate: decoded.gasEstimate,
        parameters: decoded.parameters
      }
    } catch (error) {
      console.error('Error decoding transaction:', error)
      return this.getUnknownTransaction(txData)
    }
  }

  private initializeFunctionSignatures() {
    // ERC20 Token Operations
    this.functionSignatures.set('0xa9059cbb', {
      name: 'transfer',
      protocol: 'ERC20',
      description: 'Transfer tokens',
      baseRisk: 'low',
      gasEstimate: 65000
    })
    
    this.functionSignatures.set('0x095ea7b3', {
      name: 'approve',
      protocol: 'ERC20',
      description: 'Approve token spending',
      baseRisk: 'medium',
      gasEstimate: 46000
    })
    
    this.functionSignatures.set('0x23b872dd', {
      name: 'transferFrom',
      protocol: 'ERC20',
      description: 'Transfer tokens from another address',
      baseRisk: 'medium',
      gasEstimate: 70000
    })

    // Uniswap V2/V3 Operations
    this.functionSignatures.set('0x38ed1739', {
      name: 'swapExactTokensForTokens',
      protocol: 'Uniswap',
      description: 'Swap exact amount of tokens for tokens',
      baseRisk: 'medium',
      gasEstimate: 180000
    })
    
    this.functionSignatures.set('0x7ff36ab5', {
      name: 'swapExactETHForTokens',
      protocol: 'Uniswap',
      description: 'Swap exact ETH for tokens',
      baseRisk: 'medium',
      gasEstimate: 160000
    })
    
    this.functionSignatures.set('0x18cbafe5', {
      name: 'swapExactTokensForETH',
      protocol: 'Uniswap',
      description: 'Swap exact tokens for ETH',
      baseRisk: 'medium',
      gasEstimate: 170000
    })
    
    this.functionSignatures.set('0x02751cec', {
      name: 'addLiquidity',
      protocol: 'Uniswap',
      description: 'Add liquidity to pool',
      baseRisk: 'high',
      gasEstimate: 200000
    })
    
    this.functionSignatures.set('0xbaa2abde', {
      name: 'removeLiquidity',
      protocol: 'Uniswap',
      description: 'Remove liquidity from pool',
      baseRisk: 'medium',
      gasEstimate: 180000
    })

    // NFT Operations (ERC721)
    this.functionSignatures.set('0x42842e0e', {
      name: 'safeTransferFrom',
      protocol: 'ERC721',
      description: 'Safely transfer NFT',
      baseRisk: 'medium',
      gasEstimate: 80000
    })
    
    this.functionSignatures.set('0x6352211e', {
      name: 'ownerOf',
      protocol: 'ERC721',
      description: 'Check NFT owner',
      baseRisk: 'low',
      gasEstimate: 25000
    })

    // DeFi Lending
    this.functionSignatures.set('0x1249c58b', {
      name: 'mint',
      protocol: 'Compound',
      description: 'Deposit and mint cTokens',
      baseRisk: 'medium',
      gasEstimate: 150000
    })
    
    this.functionSignatures.set('0x2e1a7d4d', {
      name: 'withdraw',
      protocol: 'Compound',
      description: 'Withdraw deposited funds',
      baseRisk: 'low',
      gasEstimate: 120000
    })
  }

  private decodeBySignature(signature: string, txData: any) {
    const func = this.functionSignatures.get(signature)
    
    if (!func) {
      return {
        functionName: 'unknown',
        protocol: 'Unknown',
        description: 'Unknown function call',
        baseRisk: 'high',
        gasEstimate: 200000,
        parameters: {}
      }
    }

    // Try to decode parameters (basic parsing)
    const parameters = this.extractParameters(signature, txData.data)

    return {
      ...func,
      parameters
    }
  }

  private extractParameters(signature: string, data: string): any {
    // Remove function signature to get parameters
    const params = data.slice(10)
    
    // Basic parameter extraction (would need ABI for proper decoding)
    return {
      rawParams: params,
      paramCount: params.length / 64
    }
  }

  private assessRisk(decoded: any, txData: any): 'low' | 'medium' | 'high' | 'critical' {
    let riskScore = 0

    // Base risk from function type
    const baseRiskScores = { low: 0, medium: 2, high: 3, critical: 4 }
    riskScore += baseRiskScores[decoded.baseRisk as keyof typeof baseRiskScores] || 2

    // Value-based risk (if ETH is being sent)
    const valueInEth = parseFloat(ethers.formatEther(txData.value || '0'))
    if (valueInEth > 10) riskScore += 4
    else if (valueInEth > 5) riskScore += 3
    else if (valueInEth > 1) riskScore += 2
    else if (valueInEth > 0.1) riskScore += 1

    // Function-specific risks
    if (decoded.functionName === 'approve') riskScore += 2
    if (decoded.functionName === 'addLiquidity') riskScore += 2
    if (decoded.functionName === 'unknown') riskScore += 4

    // Gas-based risk
    if (decoded.gasEstimate > 300000) riskScore += 2
    else if (decoded.gasEstimate > 200000) riskScore += 1

    // Determine final risk level
    if (riskScore >= 8) return 'critical'
    if (riskScore >= 5) return 'high'
    if (riskScore >= 3) return 'medium'
    return 'low'
  }

  private generateExplanation(decoded: any, txData: any): string {
    const valueInEth = parseFloat(ethers.formatEther(txData.value || '0'))
    const toAddress = `${txData.to.slice(0, 6)}...${txData.to.slice(-4)}`
    const fromAddress = txData.from ? `${txData.from.slice(0, 6)}...${txData.from.slice(-4)}` : 'your wallet'

    switch (decoded.functionName) {
      case 'transfer':
        return `You are about to transfer tokens to ${toAddress}. This is an ERC20 token transfer operation.`
      
      case 'approve':
        return `⚠️ You are about to grant approval for ${toAddress} to spend your tokens. This contract will be able to move tokens from your wallet without further permission.`
      
      case 'transferFrom':
        return `You are authorizing a transfer of tokens from one address to another through contract ${toAddress}.`
      
      case 'swapExactTokensForTokens':
      case 'swapExactETHForTokens':
      case 'swapExactTokensForETH':
        return `You are about to execute a token swap on ${decoded.protocol}${valueInEth > 0 ? ` with ${valueInEth.toFixed(4)} ETH` : ''}.`
      
      case 'addLiquidity':
        return `You are about to add liquidity to a ${decoded.protocol} pool. Your tokens will be locked in the liquidity pool and you'll receive LP tokens in return.`
      
      case 'removeLiquidity':
        return `You are about to remove liquidity from a ${decoded.protocol} pool and receive your tokens back.`
      
      case 'safeTransferFrom':
        return `You are about to transfer an NFT (ERC721 token) ${txData.from ? `from ${fromAddress} ` : ''}to ${toAddress}.`
      
      case 'mint':
        return `You are about to deposit funds into ${decoded.protocol} lending protocol to earn interest.`
      
      case 'withdraw':
        return `You are about to withdraw your deposited funds from ${decoded.protocol} lending protocol.`
      
      case 'unknown':
        return `⚠️ You are about to execute an unknown function on contract ${toAddress}${valueInEth > 0 ? ` with ${valueInEth.toFixed(4)} ETH` : ''}. This transaction has not been identified by our security system.`
      
      default:
        return `You are about to interact with contract ${toAddress} on ${decoded.protocol}${valueInEth > 0 ? ` with ${valueInEth.toFixed(4)} ETH` : ''}.`
    }
  }

  private generateWarnings(decoded: any, riskLevel: string, txData: any): string[] {
    const warnings: string[] = []
    const valueInEth = parseFloat(ethers.formatEther(txData.value || '0'))

    // Risk-level warnings
    if (riskLevel === 'critical') {
      warnings.push('🚨 CRITICAL RISK: This transaction has multiple high-risk factors. Please verify all details carefully.')
    } else if (riskLevel === 'high') {
      warnings.push('⚠️ HIGH RISK: This transaction involves significant risk. Double-check before proceeding.')
    }

    // Function-specific warnings
    if (decoded.functionName === 'approve') {
      warnings.push('🔐 TOKEN APPROVAL: You are granting spending permission. The contract can move your tokens without further approval.')
      warnings.push('💡 TIP: Consider using limited approvals instead of unlimited approvals.')
    }

    if (decoded.functionName === 'addLiquidity') {
      warnings.push('💧 LIQUIDITY LOCK: Your tokens will be locked in a liquidity pool.')
      warnings.push('📉 RISK: You may experience impermanent loss if token prices diverge.')
    }

    if (decoded.functionName === 'unknown') {
      warnings.push('❓ UNKNOWN FUNCTION: This function is not recognized by our security system.')
      warnings.push('🔍 RECOMMENDATION: Verify the contract on Etherscan before proceeding.')
    }

    // Value warnings
    if (valueInEth > 10) {
      warnings.push(`💰 HIGH VALUE: You are sending ${valueInEth.toFixed(4)} ETH. Verify the recipient address carefully.`)
    }

    // Gas warnings
    if (decoded.gasEstimate > 300000) {
      warnings.push('⛽ HIGH GAS: This transaction will consume significant gas fees.')
    }

    return warnings
  }

  private getUnknownTransaction(txData: any): DecodedTransaction {
    const valueInEth = parseFloat(ethers.formatEther(txData.value || '0'))
    
    return {
      functionName: 'unknown',
      contractAddress: txData.to,
      protocol: 'Unknown',
      riskLevel: 'high',
      explanation: `Unknown transaction to ${txData.to.slice(0, 6)}...${txData.to.slice(-4)}${valueInEth > 0 ? ` with ${valueInEth.toFixed(4)} ETH` : ''}`,
      warnings: [
        '❓ UNKNOWN TRANSACTION: Could not decode this transaction.',
        '🔍 VERIFY: Check the contract on Etherscan before proceeding.'
      ],
      gasEstimate: 200000
    }
  }
}

