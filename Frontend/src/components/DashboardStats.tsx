import { motion } from 'framer-motion'
import type { DashboardStats as Stats } from '../types'
import { 
  Activity, 
  DollarSign, 
  Layers, 
  Zap,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface DashboardStatsProps {
  stats: Stats
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Transactions',
      value: stats.totalTransactions.toLocaleString(),
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Total Volume',
      value: `$${stats.totalVolume}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
      change: '+8.5%',
      changeType: 'positive' as const
    },
    {
      title: 'Active Protocols',
      value: stats.activeProtocols.toString(),
      icon: Layers,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20',
      change: '+2',
      changeType: 'positive' as const
    },
    {
      title: 'Gas Spent',
      value: `${stats.gasSpent} ETH`,
      icon: Zap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/20',
      change: '-5.2%',
      changeType: 'negative' as const
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`relative overflow-hidden rounded-xl border backdrop-blur-sm p-6 ${card.bgColor} ${card.borderColor}`}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor} ${card.borderColor} border`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className="flex items-center space-x-1">
                {card.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm font-medium ${
                  card.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {card.change}
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {card.value}
              </h3>
              <p className="text-sm text-gray-400">
                {card.title}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
