import { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isTyping: boolean
  disabled?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isTyping, 
  disabled = false 
}) => {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled && !isTyping) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Voice recording functionality would be implemented here
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [message])

  const suggestedQuestions = [
    "How does transaction interception work?",
    "What risks should I watch for?",
    "Explain my security settings",
    "Show me recent blocked transactions"
  ]

  return (
    <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
      {/* Suggested Questions */}
      {message === '' && !isTyping && (
        <div className="p-4 border-b border-white/10">
          <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setMessage(question)}
                className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-gray-300 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end space-x-3">
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isTyping ? "AI is typing..." : "Ask me about transaction security and analysis..."}
              disabled={disabled || isTyping}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            
            {/* Character Count */}
            {message.length > 0 && (
              <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                {message.length}/500
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-colors ${
                isRecording 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              disabled={disabled || isTyping}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Send Button */}
            <motion.button
              type="submit"
              disabled={!message.trim() || disabled || isTyping}
              className={`p-3 rounded-xl transition-all duration-200 ${
                message.trim() && !disabled && !isTyping
                  ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:from-purple-700 hover:to-teal-700'
                  : 'bg-white/5 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={message.trim() && !disabled && !isTyping ? { scale: 1.05 } : {}}
              whileTap={message.trim() && !disabled && !isTyping ? { scale: 0.95 } : {}}
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  )
}
