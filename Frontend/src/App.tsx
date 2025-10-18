import { useState, useEffect } from 'react'
import { WagmiConfig, createConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains'
import { http } from 'viem'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion } from 'framer-motion'

import { WalletConnect } from './components/WalletConnect'
import { DashboardStats } from './components/DashboardStats'
import { TransactionFeed } from './components/TransactionFeed'
import { Chatbot } from './components/Chatbot'
import { mockTransactions, mockDashboardStats } from './data/mockData'
import type { Transaction } from './types'

import '@rainbow-me/rainbowkit/styles.css'

// Configure chains
const chains = [mainnet, polygon, optimism, arbitrum] as const

// Configure wallets
const { connectors } = getDefaultWallets({
  appName: 'Blockscribe',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo',
})

// Create wagmi config
const config = createConfig({
  connectors,
  chains,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
})

// Create a client
const queryClient = new QueryClient()

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  useEffect(() => {
    // Simulate loading transactions
    const loadTransactions = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setTransactions(mockTransactions)
      setIsLoading(false)
    }

    loadTransactions()
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    setTransactions([...mockTransactions]) // Refresh with same data for demo
    setIsLoading(false)
  }

  const toggleChatbot = () => {
    setIsChatbotOpen(prev => !prev)
  }

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-teal-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <h1 className="text-xl font-bold text-white">
                      Blockscribe
                    </h1>
                    <span className="px-2 py-1 bg-teal-500/20 text-teal-400 text-xs rounded-full">
                      Beta
                    </span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <WalletConnect />
                  </motion.div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Hero Section */}
                <div className="text-center mb-12">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-6"
                  >
                    The Blockchain{' '}
                    <span className="bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                      Narrator
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                  >
                    Transform complex blockchain transactions into clear, contextual, 
                    and human-readable narratives. Understand exactly what's happening 
                    on-chain without decoding hashes or logs.
                  </motion.p>
                </div>

                {/* AI Feature Highlight */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gradient-to-r from-purple-600/20 to-teal-600/20 border border-purple-500/30 rounded-2xl p-8 mb-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2 flex items-center space-x-2">
                        <span>🤖</span>
                        <span>AI-Powered Transaction Analysis</span>
                      </h2>
                      <p className="text-gray-300 mb-4 max-w-2xl">
                        Get instant insights about your blockchain activity with our intelligent AI assistant. 
                        Ask questions, analyze patterns, and understand your DeFi journey like never before.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                          Transaction Analysis
                        </span>
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-sm rounded-full">
                          Gas Optimization
                        </span>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                          Portfolio Insights
                        </span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">
                          Risk Assessment
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={toggleChatbot}
                      className="ml-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      Try AI Assistant
                    </button>
                  </div>
                </motion.div>

                {/* Dashboard Stats */}
                <DashboardStats stats={mockDashboardStats} />

                {/* Transaction Feed */}
                <TransactionFeed
                  transactions={transactions}
                  onRefresh={handleRefresh}
                  isLoading={isLoading}
                />
              </motion.div>
            </main>

            {/* AI Chatbot */}
            <Chatbot
              transactions={transactions}
              isOpen={isChatbotOpen}
              onToggle={toggleChatbot}
            />

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center text-gray-400">
                  <p>&copy; 2024 Blockscribe. Making blockchain accessible to everyone.</p>
                </div>
              </div>
            </footer>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}

export default App
