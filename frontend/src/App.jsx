import { useState } from 'react'
import './App.css'

function App() {
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!hash.trim()) {
      setError('Please enter a transaction hash')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('http://localhost:5000/translate', {
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

  const handleClear = () => {
    setHash('')
    setResult(null)
    setError('')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔗 HashDecode</h1>
        <p>Translate blockchain transaction hashes into human-readable language</p>
      </header>

      <main className="app-main">
        <form onSubmit={handleSubmit} className="hash-form">
          <div className="input-group">
            <label htmlFor="hash">Transaction Hash:</label>
            <input
              id="hash"
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="Enter a blockchain transaction hash (e.g., 0x...)"
              className="hash-input"
            />
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              disabled={loading || !hash.trim()}
              className="translate-btn"
            >
              {loading ? 'Translating...' : 'Translate Hash'}
            </button>
            <button 
              type="button" 
              onClick={handleClear}
              className="clear-btn"
            >
              Clear
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="result-container">
            <h3>✅ Translation Result</h3>
            <div className="result-content">
              <div className="result-section">
                <h4>Hash:</h4>
                <code className="hash-display">{result.hash}</code>
              </div>
              
              <div className="result-section">
                <h4>Human-Readable Translation:</h4>
                <div className="translation" dangerouslySetInnerHTML={{__html: result.translation.replace(/\n/g, '<br>').replace(/(\d+\.\s)/g, '<br>$1').replace(/^<br>/, '')}} />
              </div>

              <details className="technical-details">
                <summary>View Technical Details</summary>
                <pre className="json-display">
                  {JSON.stringify(result.originalData, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>ℹ️ How to use:</h3>
          <ol>
            <li>Enter a valid blockchain transaction hash (starts with 0x)</li>
            <li>Click "Translate Hash" to get a human-readable explanation</li>
            <li>View technical details by expanding the "View Technical Details" section</li>
          </ol>
          
          <h3>📝 Example hashes to try:</h3>
          <ul>
            <li><code>0x5e1657ef0e9be9bc72efefe59a2528d0d730d478cfc9e6cdd09af9f997bb3ef4</code> (DeFi arbitrage transaction)</li>
            <li>Any valid Ethereum mainnet transaction hash (64 characters starting with 0x)</li>
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
