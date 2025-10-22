import OpenAI from 'openai'

interface AIResponse {
  message: string
  suggestions: string[]
  analysis?: any
}

export class AIService {
  private openai: OpenAI | null = null

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
    }
  }

  async generateResponse(message: string, transactions: any[], context?: any): Promise<AIResponse> {
    if (!this.openai) {
      return this.generateMockResponse(message, transactions)
    }

    try {
      const systemPrompt = this.buildSystemPrompt(transactions)
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })

      const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'

      return {
        message: response,
        suggestions: this.generateSuggestions(message, transactions),
        analysis: this.extractAnalysis(response)
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      return this.generateMockResponse(message, transactions)
    }
  }

  async analyzeTransactions(transactions: any[], analysisType: string): Promise<any> {
    if (!this.openai) {
      return this.generateMockAnalysis(transactions, analysisType)
    }

    try {
      const prompt = this.buildAnalysisPrompt(transactions, analysisType)
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a blockchain transaction analyst. Provide detailed, actionable insights.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.5
      })

      return JSON.parse(completion.choices[0]?.message?.content || '{}')
    } catch (error) {
      console.error('OpenAI analysis error:', error)
      return this.generateMockAnalysis(transactions, analysisType)
    }
  }

  async generateSuggestions(transactions: any[], type: string): Promise<string[]> {
    const suggestions: string[] = []

    // Analyze transaction patterns
    const protocols = [...new Set(transactions.map(t => t.protocol))]
    const types = [...new Set(transactions.map(t => t.type))]
    const totalVolume = transactions.reduce((sum, t) => sum + parseFloat(t.value || '0'), 0)

    // Gas optimization suggestions
    const avgGas = transactions.reduce((sum, t) => sum + parseInt(t.gasUsed || '0'), 0) / transactions.length
    if (avgGas > 200000) {
      suggestions.push('Consider batching transactions to reduce gas costs')
    }

    // DeFi suggestions
    if (types.includes('swap') && !protocols.includes('Uniswap V3')) {
      suggestions.push('Try Uniswap V3 for better swap rates and lower fees')
    }

    if (types.includes('swap') && !types.includes('liquidity_add')) {
      suggestions.push('Consider providing liquidity to earn trading fees')
    }

    // Risk management
    if (totalVolume > 100) {
      suggestions.push('Consider diversifying across multiple protocols for risk management')
    }

    // Yield farming
    if (types.includes('lending') && !types.includes('staking')) {
      suggestions.push('Explore staking opportunities for additional yield')
    }

    return suggestions.slice(0, 5) // Limit to 5 suggestions
  }

  private buildSystemPrompt(transactions: any[]): string {
    const summary = this.buildTransactionSummary(transactions)
    
    return `You are Blockscribe, an AI assistant specialized in blockchain transaction analysis. 

User's Transaction Summary:
${summary}

Your role:
- Analyze blockchain transactions and provide clear explanations
- Offer insights about DeFi strategies, gas optimization, and risk management
- Explain complex smart contract interactions in simple terms
- Provide actionable recommendations based on transaction patterns
- Be helpful, accurate, and educational

Guidelines:
- Use emojis sparingly but effectively
- Provide specific, actionable advice
- Explain technical concepts in accessible language
- Focus on practical insights the user can act on
- Always consider gas costs and risk factors`
  }

  private buildTransactionSummary(transactions: any[]): string {
    if (transactions.length === 0) {
      return 'No recent transactions found.'
    }

    const totalVolume = transactions.reduce((sum, t) => sum + parseFloat(t.value || '0'), 0)
    const protocols = [...new Set(transactions.map(t => t.protocol))]
    const types = [...new Set(transactions.map(t => t.type))]
    const avgGas = transactions.reduce((sum, t) => sum + parseInt(t.gasUsed || '0'), 0) / transactions.length

    return `
- Total Transactions: ${transactions.length}
- Total Volume: ${totalVolume.toFixed(4)} ETH
- Active Protocols: ${protocols.join(', ')}
- Transaction Types: ${types.join(', ')}
- Average Gas Used: ${Math.round(avgGas).toLocaleString()}
- Most Recent: ${new Date(transactions[0].timestamp * 1000).toLocaleDateString()}
    `.trim()
  }

  private buildAnalysisPrompt(transactions: any[], analysisType: string): string {
    const summary = this.buildTransactionSummary(transactions)
    
    return `Analyze the following blockchain transaction data and provide a ${analysisType} analysis:

${summary}

Recent Transactions:
${transactions.slice(0, 10).map(t => 
  `- ${t.type} on ${t.protocol}: ${t.narration}`
).join('\n')}

Please provide a JSON response with the following structure:
{
  "summary": "Overall assessment",
  "insights": ["key insight 1", "key insight 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "risks": ["risk 1", "risk 2"],
  "opportunities": ["opportunity 1", "opportunity 2"],
  "gasOptimization": "gas optimization advice",
  "score": {
    "overall": 85,
    "gasEfficiency": 70,
    "diversification": 90,
    "riskManagement": 80
  }
}`
  }

  private generateMockResponse(message: string, transactions: any[]): AIResponse {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('analyze') || lowerMessage.includes('summary')) {
      return {
        message: `📊 **Transaction Analysis Summary:**\n\n• **Total Transactions:** ${transactions.length}\n• **Active Protocols:** ${[...new Set(transactions.map(t => t.protocol))].join(', ')}\n• **Transaction Types:** ${[...new Set(transactions.map(t => t.type))].join(', ')}\n\nYour portfolio shows healthy DeFi activity with good diversification.`,
        suggestions: ['Try Uniswap V3 for better rates', 'Consider staking for additional yield'],
        analysis: { type: 'summary' }
      }
    }

    if (lowerMessage.includes('gas') || lowerMessage.includes('fees')) {
      const avgGas = transactions.reduce((sum, t) => sum + parseInt(t.gasUsed || '0'), 0) / transactions.length
      return {
        message: `⛽ **Gas Analysis:**\n\n• **Average Gas Used:** ${Math.round(avgGas).toLocaleString()}\n• **Efficiency:** ${avgGas < 200000 ? 'Excellent' : 'Good'}\n• **Recommendation:** Consider batching transactions during low network activity.`,
        suggestions: ['Batch transactions', 'Use gas optimization tools'],
        analysis: { type: 'gas' }
      }
    }

    return {
      message: "I can help you analyze your blockchain transactions! Ask me about gas optimization, DeFi strategies, or specific transaction details.",
      suggestions: ['Analyze my transactions', 'Gas optimization tips', 'DeFi recommendations'],
      analysis: { type: 'general' }
    }
  }

  private generateMockAnalysis(transactions: any[], analysisType: string): any {
    return {
      summary: `Analysis of ${transactions.length} transactions`,
      insights: ['Good DeFi diversification', 'Efficient gas usage'],
      recommendations: ['Try new protocols', 'Consider staking'],
      risks: ['Market volatility', 'Smart contract risk'],
      opportunities: ['Yield farming', 'Governance participation'],
      gasOptimization: 'Batch transactions during low activity',
      score: {
        overall: 85,
        gasEfficiency: 80,
        diversification: 90,
        riskManagement: 85
      }
    }
  }

  private extractAnalysis(response: string): any {
    // Simple extraction of analysis from response
    return {
      type: 'ai_analysis',
      confidence: 0.8,
      timestamp: new Date().toISOString()
    }
  }
}
