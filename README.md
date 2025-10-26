# HashDecode

Turning blockchain transaction hashes into plain English explanations.

HashDecode takes those cryptic blockchain transaction hashes and explains what actually happened. Just paste a hash and get a clear breakdown of the transaction.

## How it works

The app fetches transaction data from Blockscout and uses OpenAI to generate human-readable explanations. It handles token swaps, DeFi operations, NFT transfers, and most Ethereum transactions.

## Setup

You'll need Node.js installed and an OpenAI API key.

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hashtalk
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend folder:
```
OPENAI_API_KEY=your_key_here
BLOCKSCOUT_API_URL=https://eth.blockscout.com/api/v2
PORT=5000
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the app

Start the backend:
```bash
cd backend
npm run dev
```

Start the frontend in another terminal:
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

## Testing

Here are some example transaction hashes to try:
- `0x5e1657ef0e9be9bc72efefe59a2528d0d730d478cfc9e6cdd09af9f997bb3ef4` - DeFi arbitrage
- `0xd839280c7211bb765cf63099b86657d3011904bce81cec8091f4017a9d652513` - Uniswap swap

The app displays transaction details, an AI-generated explanation, and technical information.

## Technology

Backend uses Express.js with Blockscout API integration and OpenAI for translations. Frontend is built with React featuring a dark theme design.

Each translation costs approximately $0.00075, making it economical to use.

## Limitations

- Only supports Ethereum mainnet transactions
- Requires valid 64-character hexadecimal hashes starting with `0x`
- Depends on Blockscout API availability
- Subject to OpenAI API rate limits

## License

MIT License - feel free to use it as you like.
