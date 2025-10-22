# Blockscribe – The Preemptive Blockchain Narrator

Blockscribe is a **pre-transaction security system** that intercepts and analyzes blockchain transactions before users sign them. By decoding smart contract interactions and assessing security risks in real-time, Blockscribe provides users with clear explanations and warnings—allowing them to make informed decisions before committing on-chain.

## 🚀 **Live Demo**

- **Frontend:** http://localhost:5176
- **Backend API:** http://localhost:3001/api/health
- **Status:** ✅ Fully functional and integrated

## 🔍 What It Does

**Real-Time Security Analysis**: When a user initiates a transaction, Blockscribe intercepts the request and analyzes it using our backend API. The system decodes function signatures, assesses security risks, and provides clear explanations like:

> "You are about to execute a token swap on Uniswap. This is a medium risk transaction."

The analysis is displayed through a beautiful security modal that appears **before the user signs the transaction**, allowing them to approve or reject based on the security assessment.

## 🛡️ Problem & Solution

**Problem**: Most users authorize blockchain transactions without fully understanding what they are signing. Hashes and calldata are opaque, making it easy for malicious or misleading contracts to exploit users.

**Solution**: Blockscribe bridges the gap between cryptographic data and user comprehension by providing real-time, pre-transaction analysis and risk assessment.
## 🛠️ Key Features

### Pre-Transaction Security
* **Transaction Interception**: Captures wallet requests before signing
* **Calldata Decoding**: Analyzes function signatures and parameters using Ethers.js
* **Risk Assessment**: Multi-level risk analysis (low, medium, high, critical)
* **Contract Analysis**: Reputation scoring and verification status
* **Security Warnings**: Real-time alerts for potential threats

### AI-Powered Analysis
* **Smart Contract Mapping**: Associates contract functions with readable templates
* **GPT Integration**: Natural-language explanations using OpenAI API
* **Context-Aware Responses**: AI understands transaction history and patterns
* **Learning System**: Continuously improves analysis accuracy

### User Experience
* **Pre-Transaction Modal**: Beautiful interface for reviewing transactions
* **Security Dashboard**: Real-time protection status and statistics
* **AI Chatbot**: Interactive security assistant for questions and insights
* **Responsive Design**: Works seamlessly on desktop and mobile

### Developer Integration
* **Embeddable Widget**: React component for dApp integration
* **Wallet Compatibility**: MetaMask, RainbowKit, WalletConnect support
* **API Endpoints**: RESTful API for transaction analysis
* **Multilingual Support**: i18n layer for global accessibility

## 🎯 Use Cases

### Security & Protection
* **DeFi Safety**: Prevent malicious swaps and unauthorized token approvals
* **NFT Security**: Verify minting and transfer transactions before signing
* **DAO Governance**: Understand voting proposals and their implications
* **High-Value Transactions**: Extra scrutiny for large ETH transfers

### User Education
* **Transaction Learning**: Help users understand what they're signing
* **Risk Awareness**: Educate about common DeFi risks and scams
* **Best Practices**: Guide users toward safer transaction patterns
* **Onboarding**: New user education through interactive explanations

### Developer Tools
* **dApp Integration**: Add security layer to any Web3 application
* **Wallet Enhancement**: Improve user experience in wallet interfaces
* **Audit Assistance**: Help developers understand transaction flows
* **Compliance**: Meet security requirements for financial applications


## 🧱 Tech Stack

### Frontend
* **React 18** with TypeScript – Modern UI framework with type safety
* **Vite** – Fast development and building
* **Tailwind CSS** – Utility-first styling with custom design system
* **Framer Motion** – Smooth animations and transitions
* **RainbowKit / Web3Modal** – Wallet connection (MetaMask, WalletConnect)
* **Wagmi** – Ethereum hooks for React to simplify smart contract interactions

### Backend
* **Node.js** – Server-side logic and API handling
* **Express.js** – Web framework for routing and middleware
* **MongoDB** – Store user summaries, mappings, and session data
* **OpenAI API** – AI-powered transaction analysis and explanations

### Blockchain Integration
* **Ethers.js** – Library for decoding transactions and interacting with contracts
* **Hardhat** – Local Ethereum development and testing environment
* **Solidity** – Smart contract language for simulating dApp interactions
* **EVM Chains** – Ethereum, Polygon, Optimism, Arbitrum support

### Security & Analysis
* **Transaction Interceptor** – Captures wallet requests before signing
* **Calldata Decoder** – Analyzes function signatures and parameters
* **Risk Assessment Engine** – Multi-level security analysis
* **Contract Registry** – Known contract database and reputation scoring

### UI Components
* **Pre-Transaction Modal** – Beautiful interface for transaction review
* **Security Dashboard** – Real-time protection status and statistics
* **AI Chatbot** – Interactive security assistant
* **Transaction Feed** – Historical transaction analysis

### Development & Deployment
* **TypeScript** – Full type safety across the stack
* **Jest / Mocha** – Unit testing for backend and smart contract logic
* **Git + GitHub** – Version control and collaboration
* **Vercel** – Frontend deployment and hosting
* **Docker** – Containerized backend deployment

## 🎨 Design System

* **Color Palette**: Dark purple (#1a0b2e), teal (#00d4aa), electric blue (#00b4d8)
* **Typography**: Inter (sans-serif), JetBrains Mono (monospace)
* **Theme**: Dark mode with glassmorphism effects
* **Animations**: Smooth transitions powered by Framer Motion
* **Responsive**: Mobile-first design approach

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet

### Installation

1. **Install dependencies**
   ```bash
   # Backend
   cd Backend
   npm install
   
   # Frontend  
   cd ../Frontend
   npm install
   ```

2. **Start the system**
   ```bash
   # Terminal 1 - Backend
   cd Backend && npm run dev
   
   # Terminal 2 - Frontend
   cd Frontend && npm run dev
   ```

3. **Test the system**
   - Open http://localhost:5176
   - Connect your wallet
   - Try a transaction on any dApp
   - Watch the security analysis appear!

### Project Structure

```
Blockscribe/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── PreTransactionModal.tsx
│   │   │   ├── TransactionInterceptor.tsx
│   │   │   ├── SecurityDashboard.tsx
│   │   │   └── Chatbot.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript definitions
│   │   └── lib/            # Utility functions
│   └── README.md
├── Backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── models/         # Database models
│   └── env.example
└── README.md               # This file
```

## 🔧 Development

### Frontend Development
```bash
cd Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd Backend
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Run ESLint
```

## ✨ Current Features

### 🛡️ **Pre-Transaction Security** (✅ Working)
- **Real-time Interception**: Captures MetaMask requests before signing
- **Risk Assessment**: Multi-level analysis (low, medium, high, critical)
- **Contract Analysis**: Reputation scoring and verification status
- **Security Warnings**: Context-aware alerts for potential threats

### 🔍 **Transaction Analysis** (✅ Working)
- **Function Decoding**: Identifies smart contract functions
- **Protocol Detection**: Recognizes Uniswap, Compound, Aave, etc.
- **Gas Estimation**: Calculates transaction complexity
- **Value Assessment**: Analyzes ETH amounts and risks

### 🎨 **User Interface** (✅ Working)
- **Security Modal**: Beautiful pre-transaction analysis display
- **Risk Indicators**: Color-coded security levels
- **Contract Info**: Name, reputation, verification status
- **Approve/Reject**: Clear decision interface

### 🚀 **Supported Operations** (✅ Working)
- ERC20 token transfers and approvals
- Uniswap V2/V3 swaps and liquidity operations
- DeFi lending (Compound, Aave)
- NFT transfers (ERC721)
- Unknown contract interactions

## 🧪 Testing Your System

### **Quick Test**
1. Open http://localhost:5176
2. Connect your MetaMask wallet
3. Try any transaction on a dApp (Uniswap, Compound, etc.)
4. Watch the security modal appear!

### **Console Testing**
```javascript
// Test in browser console:
window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [{
    to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
    data: '0x38ed1739',
    value: '0x0'
  }]
})
```

### **API Testing**
```bash
# Test backend directly
curl -X POST http://localhost:3001/api/analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{"to":"0x7a250d5630b4cf539739df2c5dacb4c659f2488d","data":"0x38ed1739","value":"0x0"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT integration
- RainbowKit for wallet connection
- Ethers.js for blockchain interaction
- Framer Motion for animations
- Tailwind CSS for styling