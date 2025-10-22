import { Router, Request, Response, NextFunction } from 'express'
import { TransactionDecoder } from '../services/TransactionDecoder'
import { RiskAssessment } from '../services/RiskAssessment'

const router = Router()
const decoder = new TransactionDecoder()
const riskAssessment = new RiskAssessment()

// Analyze transaction before signing
router.post('/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { to, data, value, from, gasLimit } = req.body

    // Validation
    if (!to || !data) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Both "to" and "data" fields are required'
      })
    }

    // Decode transaction
    const decoded = await decoder.decodeTransaction({
      to,
      data,
      value: value || '0x0',
      from
    })

    // Assess risk factors
    const riskFactors = riskAssessment.assessTransaction(decoded, {
      to,
      data,
      value: value || '0x0'
    })

    // Get contract information if available
    const contractInfo = riskAssessment.getContractInfo(to)

    res.json({
      success: true,
      data: {
        transaction: {
          to,
          from,
          value: value || '0x0',
          data: data.slice(0, 66) + '...' // Truncate long data
        },
        decoded: {
          functionName: decoded.functionName,
          protocol: decoded.protocol,
          explanation: decoded.explanation,
          warnings: decoded.warnings,
          gasEstimate: decoded.gasEstimate
        },
        risk: {
          level: decoded.riskLevel,
          factors: riskFactors,
          score: riskFactors.overallScore,
          recommendations: riskFactors.recommendations
        },
        contract: contractInfo || {
          name: 'Unknown Contract',
          reputation: 50,
          verified: false,
          category: 'Unknown'
        },
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Analysis error:', error)
    next(error)
  }
})

// Get contract information
router.get('/contract/:address', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = req.params

    if (!address || !address.startsWith('0x')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address format'
      })
    }

    const contractInfo = riskAssessment.getContractInfo(address)

    if (!contractInfo) {
      return res.json({
        success: true,
        data: {
          address,
          name: 'Unknown Contract',
          reputation: 50,
          verified: false,
          category: 'Unknown',
          warning: 'This contract is not in our verified database'
        }
      })
    }

    res.json({
      success: true,
      data: {
        address,
        ...contractInfo
      }
    })
  } catch (error) {
    next(error)
  }
})

// Batch analyze multiple transactions
router.post('/batch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactions } = req.body

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'transactions must be a non-empty array'
      })
    }

    if (transactions.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 transactions per batch'
      })
    }

    const results = await Promise.all(
      transactions.map(async (tx) => {
        try {
          const decoded = await decoder.decodeTransaction({
            to: tx.to,
            data: tx.data,
            value: tx.value || '0x0',
            from: tx.from
          })

          const riskFactors = riskAssessment.assessTransaction(decoded, tx)

          return {
            success: true,
            transaction: tx,
            decoded,
            risk: {
              level: decoded.riskLevel,
              score: riskFactors.overallScore
            }
          }
        } catch (error) {
          return {
            success: false,
            transaction: tx,
            error: 'Failed to analyze transaction'
          }
        }
      })
    )

    res.json({
      success: true,
      data: {
        results,
        total: transactions.length,
        analyzed: results.filter(r => r.success).length
      }
    })
  } catch (error) {
    next(error)
  }
})

export default router

