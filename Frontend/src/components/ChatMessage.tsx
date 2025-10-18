import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ChatMessage as ChatMessageType } from '../types/chat'
import { formatTimeAgo } from '../lib/utils'
import { Bot, User, Copy, Check } from 'lucide-react'

interface ChatMessageProps {
  message: ChatMessageType
  index: number
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, index }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '&bull;')
      .replace(/\n/g, '<br/>')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.type === 'user' 
            ? 'bg-gradient-to-r from-purple-600 to-teal-600' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        }`}>
          {message.type === 'user' ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`relative group ${
          message.type === 'user' ? 'items-end' : 'items-start'
        } flex flex-col`}>
          <div className={`px-4 py-3 rounded-2xl ${
            message.type === 'user'
              ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white'
              : 'bg-white/10 backdrop-blur-sm text-gray-100 border border-white/20'
          }`}>
            <div 
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: formatContent(message.content) 
              }}
            />
          </div>

          {/* Timestamp and Actions */}
          <div className={`flex items-center space-x-2 mt-1 ${
            message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}>
            <span className="text-xs text-gray-400">
              {formatTimeAgo(message.timestamp)}
            </span>
            
            {message.type === 'assistant' && (
              <button
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-400" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
