# Blockscribe Backend - Security API

Pre-transaction security analysis API for blockchain transactions.

## 🚀 Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
cp env.example .env
```

3. **Start development server:**
```bash
npm run dev
```

The API will be running on `http://localhost:3001`

## 📡 API Endpoints

### Health Check
```bash
GET /api/health
```

### Analyze Transaction (Main Endpoint)
```bash
POST /api/analysis/analyze
Content-Type: application/json

{
  "to": "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
  "data": "0x38ed1739...",
  "value": "0x0",
  "from": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "decoded": {
      "functionName": "swapExactTokensForTokens",
      "protocol": "Uniswap",
      "explanation": "You are about to execute a token swap on Uniswap...",
      "warnings": ["⚠️ HIGH RISK: ..."],
      "gasEstimate": 180000
    },
    "risk": {
      "level": "medium",
      "score": 5,
      "recommendations": [...]
    },
    "contract": {
      "name": "Uniswap V2 Router",
      "reputation": 95,
      "verified": true
    }
  }
}
```

### Get Contract Info
```bash
GET /api/analysis/contract/:address
```

### Batch Analysis
```bash
POST /api/analysis/batch

{
  "transactions": [
    { "to": "0x...", "data": "0x...", "value": "0x0" },
    ...
  ]
}
```

## 🧪 Testing

### Test with curl:
```bash
# Uniswap swap
curl -X POST http://localhost:3001/api/analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "to": "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
    "data": "0x38ed1739000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "value": "0x0"
  }'

# ERC20 approval
curl -X POST http://localhost:3001/api/analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
    "data": "0x095ea7b3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "value": "0x0"
  }'
```

## 🔑 Supported Functions

### ERC20 Tokens
- `transfer` - Token transfers
- `approve` - Token approvals
- `transferFrom` - Delegated transfers

### Uniswap
- `swapExactTokensForTokens` - Token swaps
- `swapExactETHForTokens` - ETH to token swaps
- `swapExactTokensForETH` - Token to ETH swaps
- `addLiquidity` - Add liquidity
- `removeLiquidity` - Remove liquidity

### DeFi Lending
- `mint` - Deposit into lending protocol
- `withdraw` - Withdraw from lending protocol

### NFTs (ERC721)
- `safeTransferFrom` - Safe NFT transfers
- `ownerOf` - Check NFT ownership

## 🛡️ Risk Assessment

### Risk Levels
- **Low**: Safe operations with minimal risk
- **Medium**: Standard DeFi operations
- **High**: Token approvals, liquidity operations
- **Critical**: Unknown functions, high-value transfers

### Risk Factors
- **Value Risk**: Amount of ETH being sent
- **Function Risk**: Type of operation
- **Contract Risk**: Contract reputation and verification status
- **Gas Risk**: Transaction complexity

## 📊 Contract Registry

Known contracts with reputation scores:
- Uniswap V2/V3 Routers (95-98)
- Compound Comptroller (96)
- Aave Lending Pool (97)
- Major stablecoins (USDT, USDC) (90-95)

## 🔧 Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🌟 Features

- **No Database Required**: All data in-memory for MVP
- **Fast Analysis**: < 100ms response time
- **Comprehensive Warnings**: Context-aware security alerts
- **Contract Registry**: Pre-loaded trusted contracts
- **Batch Processing**: Analyze multiple transactions
- **Rate Limiting**: Built-in API protection

## 📝 Notes

- This is an MVP without database persistence
- Contract registry is in-memory (resets on restart)
- For production, integrate with Alchemy/Etherscan APIs
- Add OpenAI integration for AI-powered explanations

