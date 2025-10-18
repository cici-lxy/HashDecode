import { useState, useCallback } from 'react'
import type { ChatMessage, ChatContext } from '../types/chat'
import type { Transaction } from '../types'

const MOCK_AI_RESPONSES = [
  "I can see you've been quite active with DeFi transactions! Your recent swap on Uniswap shows a good understanding of DEX trading.",
  "Looking at your transaction history, you've made 5 transactions in the last 24 hours with a total volume of $12,450.50.",
  "Your staking activity on Ethereum 2.0 is generating a 4.2% APY return. That's a solid long-term investment strategy.",
  "I notice you're participating in Uniswap governance. Your vote on proposal #123 shows you're actively involved in protocol decisions.",
  "Your gas usage has been optimized recently. The average gas price you're paying is reasonable for current network conditions.",
  "Based on your transaction patterns, you seem to prefer Uniswap for swaps and have been exploring NFT minting. Would you like me to suggest some similar protocols?",
  "Your portfolio shows a good mix of DeFi activities: trading, staking, governance, and NFT collection. This diversification is excellent for risk management.",
  "I can help you analyze any specific transaction or provide insights about your overall blockchain activity. What would you like to know more about?"
]

export const useChatbot = (transactions: Transaction[]) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hello! I'm your AI assistant for blockchain transaction analysis. I can help you understand your transaction history, explain complex DeFi activities, and provide insights about your on-chain behavior. What would you like to know?",
      timestamp: Date.now()
    }
  ])
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const context: ChatContext = {
    transactions: transactions.map(t => t.id),
    userPreferences: {
      detailLevel: 'detailed',
      language: 'en'
    }
  }

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Generate contextual response based on user input
    const response = generateAIResponse(content, transactions)
    
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, aiMessage])
    setIsTyping(false)
  }, [transactions])

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: "👋 Hello! I'm your AI assistant for blockchain transaction analysis. I can help you understand your transaction history, explain complex DeFi activities, and provide insights about your on-chain behavior. What would you like to know?",
        timestamp: Date.now()
      }
    ])
  }, [])

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return {
    messages,
    isOpen,
    isTyping,
    context,
    sendMessage,
    clearChat,
    toggleChat
  }
}

function generateAIResponse(input: string, transactions: Transaction[]): string {
  const lowerInput = input.toLowerCase()
  
  // Transaction analysis
  if (lowerInput.includes('analyze') || lowerInput.includes('summary') || lowerInput.includes('overview')) {
    const totalVolume = transactions.reduce((sum, t) => sum + parseFloat(t.value || '0'), 0)
    const transactionTypes = [...new Set(transactions.map(t => t.type))]
    return `📊 **Transaction Analysis Summary:**\n\n• **Total Transactions:** ${transactions.length}\n• **Total Volume:** $${totalVolume.toFixed(2)}\n• **Transaction Types:** ${transactionTypes.join(', ')}\n• **Most Active Protocol:** Uniswap\n• **Gas Efficiency:** Good (average 150k gas per transaction)\n\nYour portfolio shows healthy DeFi activity with good diversification across trading, staking, and governance.`
  }
  
  // Gas analysis
  if (lowerInput.includes('gas') || lowerInput.includes('fees')) {
    const avgGas = transactions.reduce((sum, t) => sum + parseInt(t.gasUsed || '0'), 0) / transactions.length
    return `⛽ **Gas Analysis:**\n\n• **Average Gas Used:** ${Math.round(avgGas).toLocaleString()}\n• **Gas Efficiency:** ${avgGas < 200000 ? 'Excellent' : avgGas < 300000 ? 'Good' : 'Could be optimized'}\n• **Recommendation:** Consider batching transactions during low network activity to save on gas fees.`
  }
  
  // DeFi insights
  if (lowerInput.includes('defi') || lowerInput.includes('yield') || lowerInput.includes('farming')) {
    return `🌾 **DeFi Insights:**\n\n• **Staking Activity:** You're earning 4.2% APY on ETH staking\n• **DEX Usage:** Primarily using Uniswap V3 for swaps\n• **Governance Participation:** Active in Uniswap governance\n• **Suggestion:** Consider exploring other yield farming opportunities on protocols like Compound or Aave for additional returns.`
  }
  
  // Specific transaction help
  if (lowerInput.includes('transaction') || lowerInput.includes('tx')) {
    return `🔍 **Transaction Help:**\n\nI can help you understand any specific transaction. You can ask me about:\n• Transaction details and explanations\n• Gas usage optimization\n• Protocol comparisons\n• Risk analysis\n• Future transaction recommendations\n\nWhich transaction would you like me to analyze?`
  }
  
  // Portfolio analysis
  if (lowerInput.includes('portfolio') || lowerInput.includes('balance') || lowerInput.includes('holdings')) {
    return `💼 **Portfolio Analysis:**\n\n• **Asset Diversity:** Good mix of ETH, USDC, and governance tokens\n• **Risk Profile:** Moderate (balanced between stable and volatile assets)\n• **Activity Level:** High (frequent trading and DeFi interactions)\n• **Recommendation:** Consider adding some stablecoin yield strategies to balance your portfolio.`
  }
  
  // Random contextual response
  return MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)]
}
