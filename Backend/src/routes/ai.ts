import { Router, Request, Response, NextFunction } from 'express'
import { AIService } from '../services/aiService'
import { Transaction } from '../models/Transaction'

const router = Router()

// Chat with AI about transactions
router.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, walletAddress, context } = req.body

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      })
    }

    // Get recent transactions for context
    let transactions = []
    if (walletAddress) {
      transactions = await Transaction
        .find({
          $or: [
            { from: walletAddress.toLowerCase() },
            { to: walletAddress.toLowerCase() }
          ]
        })
        .sort({ timestamp: -1 })
        .limit(20)
        .lean()
    }

    const aiService = new AIService()
    const response = await aiService.generateResponse(message, transactions, context)

    res.json({
      success: true,
      data: {
        message: response.message,
        suggestions: response.suggestions,
        analysis: response.analysis
      }
    })
  } catch (error) {
    next(error)
  }
})

// Analyze transaction patterns
router.post('/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress, analysisType = 'general' } = req.body

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      })
    }

    // Get transaction data
    const transactions = await Transaction
      .find({
        $or: [
          { from: walletAddress.toLowerCase() },
          { to: walletAddress.toLowerCase() }
        ]
      })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean()

    const aiService = new AIService()
    const analysis = await aiService.analyzeTransactions(transactions, analysisType)

    res.json({
      success: true,
      data: analysis
    })
  } catch (error) {
    next(error)
  }
})

// Get AI suggestions
router.get('/suggestions/:walletAddress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress } = req.params
    const { type = 'general' } = req.query

    const transactions = await Transaction
      .find({
        $or: [
          { from: walletAddress.toLowerCase() },
          { to: walletAddress.toLowerCase() }
        ]
      })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean()

    const aiService = new AIService()
    const suggestions = await aiService.generateSuggestions(transactions, type as string)

    res.json({
      success: true,
      data: suggestions
    })
  } catch (error) {
    next(error)
  }
})

export default router
