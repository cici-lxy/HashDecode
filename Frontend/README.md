# Blockscribe Frontend

A modern React frontend for the Blockscribe blockchain transaction narrator.

## Features

- 🎨 **Modern UI/UX**: Dark theme with purple/teal gradient design
- 🔗 **Wallet Integration**: RainbowKit + Web3Modal for seamless wallet connection
- 📱 **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- ⚡ **Real-time Updates**: Live transaction feed with smooth animations
- 🔍 **Search & Filter**: Find transactions by type or search terms
- 📊 **Dashboard Stats**: Overview of transaction activity and volume
- 🎭 **Transaction Narrations**: Human-readable explanations of blockchain activities

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **RainbowKit** for wallet connection
- **Wagmi** for Ethereum interactions
- **Lucide React** for icons

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   VITE_ALCHEMY_ID=your_alchemy_api_key_here
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

## Environment Variables

- `VITE_WALLETCONNECT_PROJECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
- `VITE_ALCHEMY_ID`: Get from [Alchemy](https://www.alchemy.com/)

## Project Structure

```
src/
├── components/          # React components
│   ├── TransactionCard.tsx
│   ├── WalletConnect.tsx
│   ├── DashboardStats.tsx
│   └── TransactionFeed.tsx
├── data/               # Mock data and constants
│   └── mockData.ts
├── lib/                # Utility functions
│   └── utils.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
└── index.css           # Global styles and Tailwind imports
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Design System

### Colors
- **Primary**: Dark Purple (`#1a0b2e`, `#2d1b69`)
- **Secondary**: Teal (`#00d4aa`, `#00a693`)
- **Accent**: Electric Blue (`#00b4d8`)
- **Background**: Deep Dark (`#0a0a0a`)
- **Surface**: Dark Gray (`#1a1a1a`)

### Typography
- **Font Family**: Inter (sans-serif), JetBrains Mono (monospace)
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable text with proper contrast

### Components
- **Cards**: Rounded corners, subtle borders, backdrop blur
- **Buttons**: Gradient backgrounds, hover effects, smooth transitions
- **Animations**: Framer Motion for smooth, performant animations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details