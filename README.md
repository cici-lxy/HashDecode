# HashDecode - Blockchain Transaction Translator

A simple web app that turns confusing blockchain transaction hashes into plain English explanations. Built with React and Node.js, it uses the Blockscout API to fetch transaction data and OpenAI to generate human-readable descriptions.

## What it does

Ever looked at a transaction hash like `0x5e1657ef0e9be9bc72efefe59a2528d0d730d478cfc9e6cdd09af9f997bb3ef4` and wondered what the hell it actually does? This app solves that problem.

Just paste any Ethereum transaction hash, and it'll tell you exactly what happened - token swaps, DeFi operations, NFT transfers, whatever. No more staring at hex codes trying to figure out if someone just moved some tokens around or executed a complex arbitrage strategy.

## Getting started

### Prerequisites

- Node.js (v16 or higher)
- An OpenAI API key
- Basic understanding of how blockchain transactions work

### Installation

1. Clone the repo:
```bash
git clone <your-repo-url>
cd hashtalk
```

2. Set up the backend:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
BLOCKSCOUT_API_URL=https://eth.blockscout.com/api/v2
PORT=5000
```

4. Set up the frontend:
```bash
cd ../frontend
npm install
```

### Running the app

Start both servers:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

## How to use

1. Find a transaction hash (they all start with `0x` and are 64 characters long)
2. Paste it into the input field
3. Click "Translate Hash"
4. Read the explanation

The app will show you:
- What the transaction actually did
- Which tokens were involved
- How much was transferred
- Which protocols were used

You can also expand the "Technical Details" section to see the raw blockchain data if you're into that sort of thing.

## Example transactions to try

Here are some real transaction hashes you can test with:

- `0x5e1657ef0e9be9bc72efefe59a2528d0d730d478cfc9e6cdd09af9f997bb3ef4` - Complex DeFi arbitrage
- `0xd839280c7211bb765cf63099b86657d3011904bce81cec8091f4017a9d652513` - Uniswap token swap

## Technical details

### Backend
- Express.js server
- Blockscout API integration for transaction data
- OpenAI GPT-3.5-turbo for translations
- Proper error handling and validation

### Frontend
- React with modern hooks
- Glass-morphism UI design
- Responsive layout
- Real-time translation updates

### API endpoints
- `POST /translate` - Main translation endpoint
- `GET /health` - Health check
- `GET /` - Basic status

## Cost considerations

Each translation costs roughly $0.00075 (less than a penny). The app uses GPT-3.5-turbo which is pretty cheap for this use case. You can monitor your usage in the OpenAI dashboard.

## Limitations

- Only works with Ethereum mainnet transactions
- Requires valid transaction hashes (64 hex characters)
- Depends on Blockscout API availability
- OpenAI API rate limits apply

## Contributing

Feel free to submit issues or pull requests. The codebase is pretty straightforward - backend handles the API calls and AI processing, frontend handles the UI.

## License

MIT License - do whatever you want with it.

---

Built by someone who got tired of manually decoding blockchain transactions. If this saves you time, consider it a win.
