import { useState } from 'react'
import type { Transaction } from '../types'
import { TransactionCard } from './TransactionCard'
import { Search, Filter, RefreshCw } from 'lucide-react'

interface TransactionFeedProps {
  transactions: Transaction[]
  onRefresh?: () => void
  isLoading?: boolean
}

export const TransactionFeed: React.FC<TransactionFeedProps> = ({ 
  transactions, 
  onRefresh, 
  isLoading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.narration.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || transaction.type === filterType
    return matchesSearch && matchesFilter
  })

  const transactionTypes = ['all', 'swap', 'mint', 'transfer', 'stake', 'vote', 'claim']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Transaction Feed
          </h2>
          <p className="text-gray-400">
            Real-time blockchain activity in human-readable format
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {transactionTypes.map(type => (
              <option key={type} value={type} className="bg-gray-800">
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction Count */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </span>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-32 bg-white/5 rounded-xl shimmer"
              />
            ))}
          </div>
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              index={index}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No transactions found
            </h3>
            <p className="text-gray-400">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Your transaction history will appear here'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
