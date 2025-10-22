import { ethers } from 'ethers'

export interface RiskFactors {
  valueRisk: number
  functionRisk: number
  contractRisk: number
  gasRisk: number
  overallScore: number
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
}

export interface ContractInfo {
  name: string
  reputation: number
  verified: boolean
  category: string
}

export class RiskAssessment {
  private knownContracts: Map<string, ContractInfo> = new Map()

  constructor() {
    this.initializeKnownContracts()
  }

  assessTransaction(decoded: any, txData: any): RiskFactors {
    const valueRisk = this.assessValueRisk(txData.value)
    const functionRisk = this.assessFunctionRisk(decoded.functionName)
    const contractRisk = this.assessContractRisk(txData.to)
    const gasRisk = this.assessGasRisk(decoded.gasEstimate)

    const overallScore = valueRisk + functionRisk + contractRisk + gasRisk
    const overallRisk = this.calculateOverallRisk(overallScore)
    const recommendations = this.generateRecommendations(decoded, txData, overallRisk)

    return {
      valueRisk,
      functionRisk,
      contractRisk,
      gasRisk,
      overallScore,
      overallRisk,
      recommendations
    }
  }

  getContractInfo(address: string): ContractInfo | null {
    return this.knownContracts.get(address.toLowerCase()) || null
  }

  private initializeKnownContracts() {
    // Uniswap Contracts
    this.knownContracts.set('0x7a250d5630b4cf539739df2c5dacb4c659f2488d', {
      name: 'Uniswap V2 Router',
      reputation: 95,
      verified: true,
      category: 'DEX'
    })
    
    this.knownContracts.set('0xe592427a0aece92de3edee1f18e0157c05861564', {
      name: 'Uniswap V3 Router',
      reputation: 98,
      verified: true,
      category: 'DEX'
    })
    
    this.knownContracts.set('0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45', {
      name: 'Uniswap V3 Router 2',
      reputation: 98,
      verified: true,
      category: 'DEX'
    })

    // Compound Contracts
    this.knownContracts.set('0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b', {
      name: 'Compound Comptroller',
      reputation: 96,
      verified: true,
      category: 'Lending'
    })

    // Aave Contracts
    this.knownContracts.set('0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9', {
      name: 'Aave Lending Pool',
      reputation: 97,
      verified: true,
      category: 'Lending'
    })

    // Popular Token Contracts
    this.knownContracts.set('0xdac17f958d2ee523a2206206994597c13d831ec7', {
      name: 'Tether (USDT)',
      reputation: 90,
      verified: true,
      category: 'Token'
    })
    
    this.knownContracts.set('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', {
      name: 'USD Coin (USDC)',
      reputation: 95,
      verified: true,
      category: 'Token'
    })
  }

  private assessValueRisk(value: string): number {
    const valueInEth = parseFloat(ethers.formatEther(value || '0'))
    
    if (valueInEth === 0) return 0
    if (valueInEth > 10) return 4
    if (valueInEth > 5) return 3
    if (valueInEth > 1) return 2
    if (valueInEth > 0.1) return 1
    return 0
  }

  private assessFunctionRisk(functionName: string): number {
    const riskMap: Record<string, number> = {
      'unknown': 4,
      'approve': 3,
      'addLiquidity': 3,
      'transferFrom': 2,
      'swapExactTokensForTokens': 2,
      'swapExactETHForTokens': 2,
      'swapExactTokensForETH': 2,
      'safeTransferFrom': 2,
      'mint': 2,
      'removeLiquidity': 1,
      'withdraw': 1,
      'transfer': 1,
      'ownerOf': 0
    }

    return riskMap[functionName] || 2
  }

  private assessContractRisk(address: string): number {
    const contract = this.knownContracts.get(address.toLowerCase())
    
    if (!contract) {
      return 3 // Unknown contract = medium-high risk
    }

    if (!contract.verified) {
      return 3 // Unverified contract = high risk
    }

    // Risk based on reputation score
    if (contract.reputation >= 90) return 0 // High reputation = low risk
    if (contract.reputation >= 70) return 1 // Good reputation = slight risk
    if (contract.reputation >= 50) return 2 // Medium reputation = medium risk
    return 3 // Low reputation = high risk
  }

  private assessGasRisk(gasEstimate: number): number {
    if (gasEstimate > 500000) return 2
    if (gasEstimate > 300000) return 1
    return 0
  }

  private calculateOverallRisk(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 10) return 'critical'
    if (score >= 7) return 'high'
    if (score >= 4) return 'medium'
    return 'low'
  }

  private generateRecommendations(decoded: any, txData: any, riskLevel: string): string[] {
    const recommendations: string[] = []
    const contractInfo = this.getContractInfo(txData.to)

    // General recommendations based on risk level
    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push('🔍 Verify the contract address on Etherscan')
      recommendations.push('🛡️ Consider testing with a small amount first')
    }

    // Contract-specific recommendations
    if (!contractInfo) {
      recommendations.push('📋 Check if the contract is verified on Etherscan')
      recommendations.push('👥 Research the project and read reviews')
    }

    // Function-specific recommendations
    if (decoded && decoded.functionName === 'approve') {
      recommendations.push('💡 Use limited approvals instead of unlimited amounts')
      recommendations.push('🔒 Revoke unused approvals regularly')
    }

    if (decoded && decoded.functionName === 'addLiquidity') {
      recommendations.push('📊 Understand impermanent loss before providing liquidity')
      recommendations.push('⏰ Monitor your position regularly')
    }

    if (decoded && decoded.functionName && decoded.functionName.includes('swap')) {
      recommendations.push('💱 Check slippage tolerance settings')
      recommendations.push('⏱️ Consider transaction timing during high volatility')
    }

    // Value-based recommendations
    const valueInEth = parseFloat(ethers.formatEther(txData.value || '0'))
    if (valueInEth > 5) {
      recommendations.push('💰 Double-check recipient address for large transfers')
      recommendations.push('🔐 Consider using a hardware wallet for large transactions')
    }

    // Gas recommendations
    if (decoded.gasEstimate > 300000) {
      recommendations.push('⛽ Transaction will use high gas - wait for lower gas prices if not urgent')
    }

    return recommendations.slice(0, 5) // Limit to 5 recommendations
  }
}

