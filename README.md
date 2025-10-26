# HashDecode

Ever stared at a transaction hash like `0x5e1657ef0e9be9bc72efefe59a2528d0d730d478cfc9e6cdd09af9f997bb3ef4` and had absolutely no idea what it does? Yeah, me too. That's why I built this.

HashDecode takes those cryptic blockchain transaction hashes and explains them in plain English. Just paste a hash, hit translate, and you'll get a breakdown of what actually happened.

## How it works

I scrape transaction data from Blockscout, throw it at ChatGPT, and it spits back something humans can actually understand. Token swaps, DeFi stuff, NFT transfers - it covers most things.

## Getting it running

You'll need Node.js and an OpenAI API key. Clone this repo, then:

```bash
# Backend
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
OPENAI_API_KEY=your_key_here
BLOCKSCOUT_API_URL=https://eth.blockscout.com/api/v2
PORT=5000
```

Then start everything:
```bash
# In backend folder
npm run dev

# In frontend folder  
cd ../frontend
npm install
npm run dev
```

Open `http://localhost:5173` and you're good to go.

## Try it out

I've been testing with these hashes:
- `0x5e1657ef0e9be9bc72efefe59a2528d0d730d478cfc9e6cdd09af9f997bb3ef4` - Some DeFi arbitrage nonsense
- `0xd839280c7211bb765cf63099b86657d3011904bce81cec8091f4017a9d652513` - Uniswap swap

The UI shows you the transaction details along with the AI explanation, plus all the technical stuff if you're into that.

## Tech stuff

Backend is Express with Blockscout API and OpenAI. Frontend is React with a dark theme because I hate bright screens. Works pretty well for the basic stuff I'm doing with it.

Each translation costs like a fraction of a penny, so it's cheap to run.

## Limitations

Only does Ethereum mainnet. Hashes have to be valid 64-character hex codes starting with `0x`. Obviously depends on Blockscout being up and your OpenAI API having credits.

## License

MIT. Use it however you want.

---

Built this because I got tired of manually figuring out what transactions do. If it saves you time, cool. If not, ¯\\_(ツ)_/¯
