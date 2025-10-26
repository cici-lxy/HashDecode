# Blockscribe Frontend

A modern React frontend for the Blockscribe blockchain transaction narrator with AI-powered analysis capabilities.

## Features

- 🎨 **Modern UI/UX**: Dark theme with purple/teal gradient design
- 🔗 **Wallet Integration**: RainbowKit + Web3Modal for seamless wallet connection
- 📱 **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- ⚡ **Real-time Updates**: Live transaction feed with smooth animations
- 🔍 **Search & Filter**: Find transactions by type or search terms
- 📊 **Dashboard Stats**: Overview of transaction activity and volume
- 🎭 **Transaction Narrations**: Human-readable explanations of blockchain activities
- 🤖 **AI Chatbot**: Intelligent transaction analysis and portfolio insights
- 💬 **Smart Conversations**: Context-aware AI responses based on your transaction history
- 📈 **Portfolio Analysis**: Get insights on gas usage, DeFi strategies, and risk assessment

## Tech Stack

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for styling with custom design system
- **Framer Motion** for smooth animations and transitions
- **RainbowKit** for wallet connection and Web3 integration
- **Wagmi** for Ethereum interactions and blockchain data
- **Lucide React** for consistent iconography
- **Custom AI Chatbot** for intelligent transaction analysis

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   VITE_ALCHEMY_ID=your_alchemy_api_key_here
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

## Environment Variables

- `VITE_WALLETCONNECT_PROJECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
- `VITE_ALCHEMY_ID`: Get from [Alchemy](https://www.alchemy.com/)

## Project Structure

```
src/
├── components/          # React components
│   ├── TransactionCard.tsx    # Individual transaction display
│   ├── WalletConnect.tsx      # Wallet connection interface
│   ├── DashboardStats.tsx     # Statistics dashboard
│   ├── TransactionFeed.tsx    # Transaction list and filtering
│   ├── Chatbot.tsx           # AI chatbot container
│   ├── ChatMessage.tsx       # Individual chat message
│   └── ChatInput.tsx         # Chat input with suggestions
├── hooks/               # Custom React hooks
│   └── useChatbot.ts         # Chatbot state management
├── data/               # Mock data and constants
│   └── mockData.ts
├── lib/                # Utility functions
│   └── utils.ts
├── types/              # TypeScript type definitions
│   ├── index.ts        # Main types
│   └── chat.ts         # Chat-specific types
├── App.tsx             # Main application component
└── index.css           # Global styles and Tailwind imports
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## AI Chatbot Features

### 🤖 Intelligent Analysis
- **Transaction Analysis**: Get detailed insights about your blockchain activity
- **Portfolio Overview**: Understand your DeFi portfolio composition and performance
- **Gas Optimization**: Receive recommendations for gas fee optimization
- **Risk Assessment**: Analyze potential risks in your transaction patterns
- **DeFi Insights**: Learn about yield farming, staking, and governance strategies

### 💬 Smart Conversations
- **Context-Aware**: AI understands your specific transaction history
- **Natural Language**: Ask questions in plain English
- **Suggested Prompts**: Quick-start questions for common queries
- **Copy Responses**: Easy copying of AI insights and recommendations
- **Voice Ready**: UI prepared for voice input integration

### 🎨 Chat Interface
- **Floating Button**: Non-intrusive chat toggle in bottom-right corner
- **Modern Design**: Glassmorphism effects with backdrop blur
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive**: Works perfectly on all screen sizes
- **Dark Theme**: Consistent with overall design system

## Design System

### Colors
- **Primary**: Dark Purple (`#1a0b2e`, `#2d1b69`)
- **Secondary**: Teal (`#00d4aa`, `#00a693`)
- **Accent**: Electric Blue (`#00b4d8`)
- **Background**: Deep Dark (`#0a0a0a`)
- **Surface**: Dark Gray (`#1a1a1a`)
- **Chat**: Glassmorphism with white/10 opacity overlays

### Typography
- **Font Family**: Inter (sans-serif), JetBrains Mono (monospace)
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable text with proper contrast
- **Chat Messages**: Optimized for readability with proper spacing

### Components
- **Cards**: Rounded corners, subtle borders, backdrop blur
- **Buttons**: Gradient backgrounds, hover effects, smooth transitions
- **Chat Bubbles**: Distinct styling for user vs AI messages
- **Animations**: Framer Motion for smooth, performant animations
- **Floating Elements**: Smooth slide-up animations for modals

## Usage Examples

### 🤖 AI Chatbot Queries

Try asking the AI assistant these questions:

```
"Analyze my transaction history"
"What's my gas usage like?"
"Explain my DeFi portfolio"
"How can I optimize my trading?"
"What are the risks in my portfolio?"
"Tell me about my staking rewards"
"Compare my trading patterns"
"Suggest better yield farming strategies"
```

### 📱 Mobile Experience

The chatbot is fully responsive and works great on mobile:
- Touch-friendly interface
- Swipe gestures for easy navigation
- Optimized message bubbles for small screens
- Voice input ready for hands-free interaction

### 🎯 Key Features in Action

1. **Transaction Analysis**: Click any transaction to get AI insights
2. **Portfolio Overview**: Ask for a complete portfolio analysis
3. **Gas Optimization**: Get recommendations for reducing gas fees
4. **Risk Assessment**: Understand potential risks in your DeFi activities
5. **Educational Content**: Learn about blockchain concepts through conversation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including chatbot functionality)
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use Framer Motion for animations
- Maintain consistent styling with Tailwind CSS
- Test chatbot responses with various transaction types
- Ensure mobile responsiveness

## License

MIT License - see LICENSE file for details

## Support

For questions about the AI chatbot or any other features:
- Check the component documentation in `/src/components/`
- Review the chatbot hook implementation in `/src/hooks/useChatbot.ts`
- Test with the provided mock data in `/src/data/mockData.ts`