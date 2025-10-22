import { Router, Request, Response, NextFunction } from 'express'
import { Transaction } from '../models/Transaction'
import { BlockchainService } from '../services/blockchainService'
import { NarrationService } from '../services/narrationService'

const router = Router()

// Get transactions for a wallet address
router.get('/wallet/:address', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = req.params
    const { 
      chainId = '1', 
      limit = '50', 
      offset = '0',
      type,
      protocol,
      category 
    } = req.query

    const query: any = {
      $or: [
        { from: address.toLowerCase() },
        { to: address.toLowerCase() }
      ],
      chainId: parseInt(chainId as string)
    }

    // Add filters
    if (type) query.type = type
    if (protocol) query.protocol = protocol
    if (category) query['metadata.category'] = category

    const transactions = await Transaction
      .find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(offset as string))
      .lean()

    res.json({
      success: true,
      data: transactions,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: await Transaction.countDocuments(query)
      }
    })
  } catch (error) {
    next(error)
  }
})

// Get transaction by hash
router.get('/hash/:hash', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hash } = req.params

    const transaction = await Transaction.findOne({ hash }).lean()

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      })
    }

    res.json({
      success: true,
      data: transaction
    })
  } catch (error) {
    next(error)
  }
})

// Process new transaction
router.post('/process', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hash, chainId } = req.body

    if (!hash || !chainId) {
      return res.status(400).json({
        success: false,
        error: 'Transaction hash and chain ID are required'
      })
    }

    // Check if transaction already exists
    const existingTransaction = await Transaction.findOne({ hash })
    if (existingTransaction) {
      return res.json({
        success: true,
        data: existingTransaction,
        message: 'Transaction already processed'
      })
    }

    // Fetch transaction data from blockchain
    const blockchainService = new BlockchainService()
    const rawTransaction = await blockchainService.getTransaction(hash, chainId)

    if (!rawTransaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found on blockchain'
      })
    }

    // Generate narration
    const narrationService = new NarrationService()
    const narration = await narrationService.generateNarration(rawTransaction)

    // Create transaction record
    const transaction = new Transaction({
      ...rawTransaction,
      narration: narration.text,
      metadata: narration.metadata
    })

    await transaction.save()

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction processed successfully'
    })
  } catch (error) {
    next(error)
  }
})

// Get transaction statistics
router.get('/stats/:address', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = req.params
    const { chainId = '1', days = '30' } = req.query

    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string))

    const query = {
      $or: [
        { from: address.toLowerCase() },
        { to: address.toLowerCase() }
      ],
      chainId: parseInt(chainId as string),
      timestamp: { $gte: Math.floor(daysAgo.getTime() / 1000) }
    }

    const stats = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalVolume: { $sum: { $toDouble: '$value' } },
          avgGasUsed: { $avg: { $toDouble: '$gasUsed' } },
          protocols: { $addToSet: '$protocol' },
          types: { $addToSet: '$type' },
          categories: { $addToSet: '$metadata.category' }
        }
      }
    ])

    const result = stats[0] || {
      totalTransactions: 0,
      totalVolume: 0,
      avgGasUsed: 0,
      protocols: [],
      types: [],
      categories: []
    }

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
})

export default router
