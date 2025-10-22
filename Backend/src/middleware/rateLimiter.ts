import { Request, Response, NextFunction } from 'express'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.ip || 'unknown'
  const now = Date.now()
  const windowStart = now - WINDOW_MS

  // Clean up old entries
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })

  // Get or create client record
  if (!store[clientId]) {
    store[clientId] = {
      count: 0,
      resetTime: now + WINDOW_MS
    }
  }

  const client = store[clientId]

  // Reset if window has passed
  if (now > client.resetTime) {
    client.count = 0
    client.resetTime = now + WINDOW_MS
  }

  // Check if limit exceeded
  if (client.count >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests',
      message: `Rate limit exceeded. Try again in ${Math.ceil((client.resetTime - now) / 1000)} seconds`,
      retryAfter: Math.ceil((client.resetTime - now) / 1000)
    })
  }

  // Increment counter
  client.count++

  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': MAX_REQUESTS.toString(),
    'X-RateLimit-Remaining': (MAX_REQUESTS - client.count).toString(),
    'X-RateLimit-Reset': new Date(client.resetTime).toISOString()
  })

  next()
}
