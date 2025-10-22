import { ethers } from 'ethers'

interface ChainConfig {
  name: string
  rpcUrl: string
  chainId: number
  blockExplorer: string
}

const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  '1': {
    name: 'Ethereum',
    rpcUrl: process.env.ETHEREUM_RPC_URL || '',
    chainId: 1,
    blockExplorer: 'https://etherscan.io'
  },
  '137': {
    name: 'Polygon',
    rpcUrl: process.env.POLYGON_RPC_URL || '',
    chainId: 137,
    blockExplorer: 'https://polygonscan.com'
  },
  '10': {
    name: 'Optimism',
    rpcUrl: process.env.OPTIMISM_RPC_URL || '',
    chainId: 10,
    blockExplorer: 'https://optimistic.etherscan.io'
  },
  '42161': {
    name: 'Arbitrum',
    rpcUrl: process.env.ARBITRUM_RPC_URL || '',
    chainId: 42161,
    blockExplorer: 'https://arbiscan.io'
  }
}

export class BlockchainService {
  private providers: Map<number, ethers.JsonRpcProvider> = new Map()

  private getProvider(chainId: number): ethers.JsonRpcProvider {
    if (!this.providers.has(chainId)) {
      const config = CHAIN_CONFIGS[chainId.toString()]
      if (!config || !config.rpcUrl) {
        throw new Error(`Unsupported chain ID: ${chainId}`)
      }
      
      const provider = new ethers.JsonRpcProvider(config.rpcUrl)
      this.providers.set(chainId, provider)
    }
    
    return this.providers.get(chainId)!
  }

  async getTransaction(txHash: string, chainId: string) {
    try {
      const provider = this.getProvider(parseInt(chainId))
      
      // Get transaction details
      const tx = await provider.getTransaction(txHash)
      if (!tx) {
        throw new Error('Transaction not found')
      }

      // Get transaction receipt
      const receipt = await provider.getTransactionReceipt(txHash)
      if (!receipt) {
        throw new Error('Transaction receipt not found')
      }

      // Get block details
      const block = await provider.getBlock(tx.blockNumber!)
      
      // Decode transaction data
      const decodedData = await this.decodeTransactionData(tx, receipt)

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to || '',
        value: ethers.formatEther(tx.value),
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: tx.gasPrice?.toString() || '0',
        blockNumber: tx.blockNumber!,
        blockHash: tx.blockHash!,
        transactionIndex: tx.transactionIndex!,
        timestamp: block?.timestamp || 0,
        chainId: parseInt(chainId),
        type: decodedData.type,
        protocol: decodedData.protocol,
        method: decodedData.method,
        tokens: decodedData.tokens,
        rawData: {
          input: tx.data,
          logs: receipt.logs
        }
      }
    } catch (error) {
      console.error('Error fetching transaction:', error)
      throw error
    }
  }

  private async decodeTransactionData(tx: ethers.TransactionResponse, receipt: ethers.TransactionReceipt) {
    // Basic transaction type detection
    let type = 'transfer'
    let protocol = 'unknown'
    let method = 'unknown'
    const tokens: any[] = []

    // Check if it's a contract interaction
    if (tx.to && tx.data !== '0x') {
      // Try to decode common function signatures
      const functionSignature = tx.data.slice(0, 10)
      
      // Common DeFi function signatures
      const functionSignatures: Record<string, { protocol: string; method: string; type: string }> = {
        '0xa9059cbb': { protocol: 'ERC20', method: 'transfer', type: 'token_transfer' },
        '0x23b872dd': { protocol: 'ERC20', method: 'transferFrom', type: 'token_transfer' },
        '0x095ea7b3': { protocol: 'ERC20', method: 'approve', type: 'token_approval' },
        '0x38ed1739': { protocol: 'Uniswap', method: 'swapExactTokensForTokens', type: 'swap' },
        '0x7ff36ab5': { protocol: 'Uniswap', method: 'swapExactETHForTokens', type: 'swap' },
        '0x18cbafe5': { protocol: 'Uniswap', method: 'swapExactTokensForETH', type: 'swap' },
        '0x02751cec': { protocol: 'Uniswap', method: 'addLiquidity', type: 'liquidity_add' },
        '0xbaa2abde': { protocol: 'Uniswap', method: 'removeLiquidity', type: 'liquidity_remove' },
        '0x1249c58b': { protocol: 'Compound', method: 'mint', type: 'lending' },
        '0x852a12e3': { protocol: 'Compound', method: 'repayBorrow', type: 'lending' },
        '0x2e1a7d4d': { protocol: 'Compound', method: 'withdraw', type: 'lending' },
        '0x095ea7b3': { protocol: 'Compound', method: 'approve', type: 'token_approval' }
      }

      const decoded = functionSignatures[functionSignature]
      if (decoded) {
        protocol = decoded.protocol
        method = decoded.method
        type = decoded.type
      } else {
        type = 'contract_interaction'
        protocol = 'unknown'
        method = 'unknown'
      }
    } else if (tx.value > 0) {
      type = 'eth_transfer'
      protocol = 'Ethereum'
      method = 'transfer'
    }

    // Parse logs for token transfers
    for (const log of receipt.logs) {
      // ERC20 Transfer event signature
      if (log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
        const from = ethers.getAddress('0x' + log.topics[1].slice(26))
        const to = ethers.getAddress('0x' + log.topics[2].slice(26))
        const amount = BigInt(log.data)
        
        tokens.push({
          address: log.address,
          from,
          to,
          amount: ethers.formatUnits(amount, 18), // Assuming 18 decimals for now
          symbol: 'UNKNOWN', // Would need to fetch from contract
          decimals: 18
        })
      }
    }

    return {
      type,
      protocol,
      method,
      tokens
    }
  }

  async getWalletTransactions(address: string, chainId: string, limit: number = 50) {
    try {
      const provider = this.getProvider(parseInt(chainId))
      
      // This would require a service like Alchemy or Moralis for historical data
      // For now, we'll return an empty array
      // In production, you'd use a service like:
      // - Alchemy's getAssetTransfers API
      // - Moralis API
      // - The Graph Protocol
      
      console.log(`Fetching transactions for ${address} on chain ${chainId}`)
      return []
    } catch (error) {
      console.error('Error fetching wallet transactions:', error)
      throw error
    }
  }
}
