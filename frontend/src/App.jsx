import { useState } from 'react'
import './App.css'

function App() {
  const [hash, setHash] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const translateHash = async () => {
    if (!hash.trim()) {
      setError('Please enter a transaction hash')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hash: hash.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to translate hash')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const clearResult = () => {
    setResult(null)
    setError('')
    setHash('')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-container">
          <img src="/logo.PNG" alt="HashDecode Logo" className="logo" />
          <h1>HashDecode</h1>
        </div>
        <p>Translate. Transact. Transcend.</p>
        <p className="subtitle">Paste any Ethereum hash, and get instant readable explanations.</p>
      </header>

      <main className="app-main">
        <div className="hash-form">
          <div className="input-group">
            <label htmlFor="hash-input">Transaction Hash</label>
            <input
              id="hash-input"
              type="text"
              className="hash-input"
              placeholder="0x5e1657ef0e9be9bc72efefe59a2528d0d730d478cfc9e6cdd09af9f997bb3ef4"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && translateHash()}
            />
          </div>
          
          <div className="button-group">
            <button 
              className="translate-btn" 
              onClick={translateHash}
              disabled={loading}
            >
              {loading ? 'Translating...' : 'Translate Hash'}
            </button>
            <button className="clear-btn" onClick={clearResult}>
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="result-container">
            <h3>✅ Translation Complete</h3>
            <div className="result-section">
              <h4>Hash</h4>
              <div className="hash-display">{result.hash}</div>
            </div>
            <div className="result-section">
              <h4>Human-Readable Explanation</h4>
              <div className="translation" dangerouslySetInnerHTML={{__html: result.translation.replace(/\n/g, '<br>').replace(/(\d+\.\s)/g, '<br>$1').replace(/^<br>/, '')}} />
            </div>
            <div className="result-section">
              <h4>Technical Details</h4>
              <div className="technical-details">
                <p><strong>From:</strong> {result.from}</p>
                <p><strong>To:</strong> {result.to}</p>
                <p><strong>Value:</strong> {result.value} ETH</p>
                <p><strong>Gas Used:</strong> {result.gasUsed}</p>
                <p><strong>Block Number:</strong> {result.blockNumber}</p>
              </div>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>How to use</h3>
          <ul>
            <li>Find a transaction hash (they all start with <code>0x</code> and are 64 characters long)</li>
            <li>Paste it into the input field above</li>
            <li>Click "Translate Hash"</li>
            <li>Read the explanation!</li>
          </ul>
          
          <h3>Example hashes to try</h3>
          <ul>
            <li><code>0x5e1657ef0e9be9bc72efefe59a2528d0d730d478cfc9e6cdd09af9f997bb3ef4</code> - Complex DeFi arbitrage</li>
            <li><code>0xd839280c7211bb765cf63099b86657d3011904bce81cec8091f4017a9d652513</code> - Uniswap token swap</li>
          </ul>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 HashDecode. All rights reserved.</p>
        <p>Powered by OpenAI & Blockscout API</p>
      </footer>
    </div>
  )
}

export default App
