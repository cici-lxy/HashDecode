import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      version: '1.0.0',
      endpoints: {
        transactions: '/api/transactions',
        ai: '/api/ai',
        health: '/api/health'
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: 'Health check failed'
    })
  }
})

export default router
