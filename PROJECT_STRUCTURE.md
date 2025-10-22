# 📁 Project Structure

```
Blockscribe/
├── Frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── TransactionInterceptor.tsx  # Captures wallet requests
│   │   │   ├── PreTransactionModal.tsx     # Security analysis modal
│   │   │   ├── SecurityDashboard.tsx       # Protection status
│   │   │   ├── Chatbot.tsx                # AI assistant
│   │   │   └── ...                        # Other UI components
│   │   ├── services/
│   │   │   └── api.ts                     # Backend API integration
│   │   ├── types/
│   │   │   └── index.ts                   # TypeScript definitions
│   │   └── App.tsx                        # Main application
│   ├── package.json
│   └── vite.config.ts
├── Backend/                     # Node.js backend API
│   ├── src/
│   │   ├── services/
│   │   │   ├── TransactionDecoder.ts      # Decodes transactions
│   │   │   └── RiskAssessment.ts         # Calculates security risks
│   │   ├── routes/
│   │   │   └── analysis.ts               # API endpoints
│   │   └── index.ts                      # Main server
│   ├── package.json
│   └── test-api.sh                       # API testing script
└── README.md                    # Main documentation
```

## 🚀 **Quick Start Commands**

```bash
# Start backend
cd Backend && npm run dev

# Start frontend (in new terminal)
cd Frontend && npm run dev

# Test API
cd Backend && ./test-api.sh
```

## 🔗 **URLs**

- **Frontend:** http://localhost:5176
- **Backend API:** http://localhost:3001/api/health
- **Analysis Endpoint:** http://localhost:3001/api/analysis/analyze
