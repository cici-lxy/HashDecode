import mongoose from 'mongoose'
import { Template } from '../models/Template'
import dotenv from 'dotenv'

dotenv.config()

const templates = [
  // Uniswap Templates
  {
    protocol: 'uniswap',
    method: 'swapExactTokensForTokens',
    functionSignature: '0x38ed1739',
    template: 'You swapped {tokenAmount} {tokenSymbol} for {outputAmount} {outputSymbol} on Uniswap with a {fee}% fee.',
    variables: [
      { name: 'tokenAmount', type: 'string', description: 'Amount of input tokens', required: true },
      { name: 'tokenSymbol', type: 'string', description: 'Symbol of input token', required: true },
      { name: 'outputAmount', type: 'string', description: 'Amount of output tokens', required: true },
      { name: 'outputSymbol', type: 'string', description: 'Symbol of output token', required: true },
      { name: 'fee', type: 'string', description: 'Trading fee percentage', required: true }
    ],
    category: 'swap',
    riskLevel: 'medium',
    gasEstimate: 180000,
    tags: ['defi', 'swap', 'uniswap', 'trading'],
    isActive: true
  },
  {
    protocol: 'uniswap',
    method: 'swapExactETHForTokens',
    functionSignature: '0x7ff36ab5',
    template: 'You swapped {ethAmount} ETH for {tokenAmount} {tokenSymbol} on Uniswap.',
    variables: [
      { name: 'ethAmount', type: 'string', description: 'Amount of ETH swapped', required: true },
      { name: 'tokenAmount', type: 'string', description: 'Amount of tokens received', required: true },
      { name: 'tokenSymbol', type: 'string', description: 'Symbol of token received', required: true }
    ],
    category: 'swap',
    riskLevel: 'medium',
    gasEstimate: 160000,
    tags: ['defi', 'swap', 'uniswap', 'eth'],
    isActive: true
  },
  {
    protocol: 'uniswap',
    method: 'addLiquidity',
    functionSignature: '0x02751cec',
    template: 'You added liquidity to a {tokenA}/{tokenB} pool on Uniswap with {amountA} {tokenA} and {amountB} {tokenB}.',
    variables: [
      { name: 'tokenA', type: 'string', description: 'First token symbol', required: true },
      { name: 'tokenB', type: 'string', description: 'Second token symbol', required: true },
      { name: 'amountA', type: 'string', description: 'Amount of first token', required: true },
      { name: 'amountB', type: 'string', description: 'Amount of second token', required: true }
    ],
    category: 'liquidity_add',
    riskLevel: 'high',
    gasEstimate: 200000,
    tags: ['defi', 'liquidity', 'uniswap', 'lp'],
    isActive: true
  },

  // ERC20 Templates
  {
    protocol: 'erc20',
    method: 'transfer',
    functionSignature: '0xa9059cbb',
    template: 'You transferred {amount} {symbol} to {recipient}.',
    variables: [
      { name: 'amount', type: 'string', description: 'Amount transferred', required: true },
      { name: 'symbol', type: 'string', description: 'Token symbol', required: true },
      { name: 'recipient', type: 'string', description: 'Recipient address', required: true }
    ],
    category: 'token_transfer',
    riskLevel: 'low',
    gasEstimate: 65000,
    tags: ['erc20', 'transfer', 'token'],
    isActive: true
  },
  {
    protocol: 'erc20',
    method: 'approve',
    functionSignature: '0x095ea7b3',
    template: 'You approved {spender} to spend {amount} {symbol} on your behalf.',
    variables: [
      { name: 'spender', type: 'string', description: 'Spender address', required: true },
      { name: 'amount', type: 'string', description: 'Approved amount', required: true },
      { name: 'symbol', type: 'string', description: 'Token symbol', required: true }
    ],
    category: 'token_approval',
    riskLevel: 'medium',
    gasEstimate: 46000,
    tags: ['erc20', 'approval', 'token'],
    isActive: true
  },

  // Compound Templates
  {
    protocol: 'compound',
    method: 'mint',
    functionSignature: '0x1249c58b',
    template: 'You deposited {amount} {symbol} into Compound to earn interest.',
    variables: [
      { name: 'amount', type: 'string', description: 'Amount deposited', required: true },
      { name: 'symbol', type: 'string', description: 'Token symbol', required: true }
    ],
    category: 'lending',
    riskLevel: 'medium',
    gasEstimate: 150000,
    tags: ['defi', 'lending', 'compound', 'yield'],
    isActive: true
  },
  {
    protocol: 'compound',
    method: 'repayBorrow',
    functionSignature: '0x2e1a7d4d',
    template: 'You repaid {amount} {symbol} borrowed from Compound.',
    variables: [
      { name: 'amount', type: 'string', description: 'Amount repaid', required: true },
      { name: 'symbol', type: 'string', description: 'Token symbol', required: true }
    ],
    category: 'lending',
    riskLevel: 'low',
    gasEstimate: 120000,
    tags: ['defi', 'lending', 'compound', 'repay'],
    isActive: true
  },

  // Aave Templates
  {
    protocol: 'aave',
    method: 'deposit',
    functionSignature: '0x617ba037',
    template: 'You deposited {amount} {symbol} into Aave lending pool.',
    variables: [
      { name: 'amount', type: 'string', description: 'Amount deposited', required: true },
      { name: 'symbol', type: 'string', description: 'Token symbol', required: true }
    ],
    category: 'lending',
    riskLevel: 'medium',
    gasEstimate: 180000,
    tags: ['defi', 'lending', 'aave', 'yield'],
    isActive: true
  },

  // Basic ETH Transfer
  {
    protocol: 'ethereum',
    method: 'transfer',
    functionSignature: '0x',
    template: 'You transferred {amount} ETH to {recipient}.',
    variables: [
      { name: 'amount', type: 'string', description: 'Amount of ETH', required: true },
      { name: 'recipient', type: 'string', description: 'Recipient address', required: true }
    ],
    category: 'eth_transfer',
    riskLevel: 'low',
    gasEstimate: 21000,
    tags: ['ethereum', 'transfer', 'eth'],
    isActive: true
  }
]

async function seedTemplates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blockscribe')
    console.log('📦 Connected to MongoDB')

    // Clear existing templates
    await Template.deleteMany({})
    console.log('🗑️ Cleared existing templates')

    // Insert new templates
    await Template.insertMany(templates)
    console.log(`✅ Seeded ${templates.length} templates`)

    // Verify seeding
    const count = await Template.countDocuments()
    console.log(`📊 Total templates in database: ${count}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding templates:', error)
    process.exit(1)
  }
}

seedTemplates()
