import type { Transaction, DashboardStats } from '../types'

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    type: 'swap',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    amount: '1.2',
    token: 'ETH',
    value: '2300.00',
    gasUsed: '150000',
    gasPrice: '20000000000',
    timestamp: Date.now() - 300000, // 5 minutes ago
    status: 'success',
    narration: 'You swapped 1.2 ETH for 2,300 USDC on Uniswap with a 0.3% fee.',
    details: {
      protocol: 'Uniswap V3',
      pool: 'ETH/USDC',
      fee: '0.3%',
      slippage: '0.1%',
      route: ['ETH', 'USDC']
    }
  },
  {
    id: '2',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    type: 'mint',
    from: '0x0000000000000000000000000000000000000000',
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    amount: '1',
    token: 'NFT',
    value: '0.08',
    gasUsed: '200000',
    gasPrice: '25000000000',
    timestamp: Date.now() - 1800000, // 30 minutes ago
    status: 'success',
    narration: 'You minted 1 NFT from the Bored Ape Yacht Club collection for 0.08 ETH.',
    details: {
      protocol: 'OpenSea',
      collection: 'Bored Ape Yacht Club',
      nftId: '#1234',
      fee: '0.08 ETH'
    }
  },
  {
    id: '3',
    hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    type: 'stake',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
    amount: '5.0',
    token: 'ETH',
    value: '0',
    gasUsed: '100000',
    gasPrice: '18000000000',
    timestamp: Date.now() - 3600000, // 1 hour ago
    status: 'success',
    narration: 'You staked 5.0 ETH in the Ethereum 2.0 staking pool.',
    details: {
      protocol: 'Ethereum 2.0',
      stakingPool: 'Beacon Chain',
      reward: '4.2% APY'
    }
  },
  {
    id: '4',
    hash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    type: 'vote',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    amount: '1000',
    token: 'UNI',
    value: '0',
    gasUsed: '80000',
    gasPrice: '15000000000',
    timestamp: Date.now() - 7200000, // 2 hours ago
    status: 'success',
    narration: 'You voted "Yes" on Uniswap governance proposal #123 with 1,000 UNI tokens.',
    details: {
      protocol: 'Uniswap Governance',
      proposalId: '#123',
      votes: '1,000 UNI'
    }
  },
  {
    id: '5',
    hash: '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff',
    type: 'transfer',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0x8ba1f109551bD432803012645Hac136c22C23e92',
    amount: '100',
    token: 'USDC',
    value: '0',
    gasUsed: '21000',
    gasPrice: '20000000000',
    timestamp: Date.now() - 86400000, // 1 day ago
    status: 'success',
    narration: 'You transferred 100 USDC to 0x8ba1...23e92.',
    details: {
      protocol: 'ERC-20'
    }
  }
]

export const mockDashboardStats: DashboardStats = {
  totalTransactions: 47,
  totalVolume: '12,450.50',
  activeProtocols: 8,
  gasSpent: '0.234'
}
