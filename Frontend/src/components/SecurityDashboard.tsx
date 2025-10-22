import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  Settings,
  Lock,
  Unlock
} from 'lucide-react'

interface SecurityStats {
  transactionsIntercepted: number
  risksDetected: number
  contractsAnalyzed: number
  protectionEnabled: boolean
  lastAnalysis: number
}

export const SecurityDashboard: React.FC = () => {
  const [stats, setStats] = useState<SecurityStats>({
    transactionsIntercepted: 0,
    risksDetected: 0,
    contractsAnalyzed: 0,
    protectionEnabled: true,
    lastAnalysis: Date.now() - 300000 // 5 minutes ago
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes === 1) return '1 minute ago'
    return `${minutes} minutes ago`
  }

  const getProtectionStatus = () => {
    if (!stats.protectionEnabled) {
      return {
        icon: <XCircle className="w-5 h-5 text-red-400" />,
        text: 'Protection Disabled',
        color: 'text-red-400',
        bgColor: 'bg-red-400/10',
        borderColor: 'border-red-400/20'
      }
    }
    
    return {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      text: 'Protection Active',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20'
    }
  }

  const protectionStatus = getProtectionStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-500/20 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Security Protection</h3>
            <p className="text-sm text-gray-400">Pre-transaction analysis & risk detection</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStats(prev => ({ ...prev, protectionEnabled: !prev.protectionEnabled }))}
            className={`p-2 rounded-lg transition-colors ${
              stats.protectionEnabled 
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            }`}
            title={stats.protectionEnabled ? 'Disable Protection' : 'Enable Protection'}
          >
            {stats.protectionEnabled ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className={`flex items-center space-x-3 p-4 rounded-xl border ${protectionStatus.bgColor} ${protectionStatus.borderColor} mb-6`}>
        {protectionStatus.icon}
        <div>
          <p className={`font-semibold ${protectionStatus.color}`}>
            {protectionStatus.text}
          </p>
          <p className="text-sm text-gray-400">
            Last analysis: {formatTimeAgo(stats.lastAnalysis)}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-white mb-1">
            {stats.transactionsIntercepted}
          </div>
          <div className="text-sm text-gray-400">Intercepted</div>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-orange-400 mb-1">
            {stats.risksDetected}
          </div>
          <div className="text-sm text-gray-400">Risks Found</div>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {stats.contractsAnalyzed}
          </div>
          <div className="text-sm text-gray-400">Contracts</div>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {stats.protectionEnabled ? '100%' : '0%'}
          </div>
          <div className="text-sm text-gray-400">Coverage</div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg font-semibold text-white mb-3">Protection Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Transaction Interception</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Calldata Decoding</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Risk Assessment</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Contract Analysis</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">Security Settings</h4>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-gray-300">Auto-approve low-risk transactions</span>
                <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-gray-300">High-value transaction alerts</span>
                <div className="w-12 h-6 bg-teal-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
