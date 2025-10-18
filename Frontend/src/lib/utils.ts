import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatAmount(amount: string | number, decimals: number = 18): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  const formatted = num / Math.pow(10, decimals)
  return formatted.toFixed(4)
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

export function getTransactionTypeIcon(type: string): string {
  const iconMap: Record<string, string> = {
    swap: '🔄',
    mint: '🎨',
    transfer: '📤',
    stake: '🔒',
    unstake: '🔓',
    vote: '🗳️',
    claim: '💰',
    burn: '🔥',
    approve: '✅',
    deposit: '📥',
    withdraw: '📤',
  }
  return iconMap[type.toLowerCase()] || '📄'
}

export function getTransactionTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    swap: 'text-teal-400',
    mint: 'text-purple-400',
    transfer: 'text-blue-400',
    stake: 'text-green-400',
    unstake: 'text-orange-400',
    vote: 'text-pink-400',
    claim: 'text-yellow-400',
    burn: 'text-red-400',
    approve: 'text-emerald-400',
    deposit: 'text-cyan-400',
    withdraw: 'text-indigo-400',
  }
  return colorMap[type.toLowerCase()] || 'text-gray-400'
}
