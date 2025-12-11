# ChessFlip 🎮♟️

**A blockchain-based memory matching game on Celo. Match chess pieces, earn points, and compete on the leaderboard.**

Play with cUSD on MiniPay, Valora, or any Celo wallet. No email signup required.

---

## 🎮 Play Now

**Live App:** [https://chessflip-celo-mainet.vercel.app/](https://chessflip-celo-mainet.vercel.app/)

**Network:** 🟢 **Celo Mainnet** (REAL MONEY)  
**Contract:** [`0xEb2b130c0846a2C183b56b49FE472e0D2a87f124`](https://celoscan.io/address/0xEb2b130c0846a2C183b56b49FE472e0D2a87f124)

⚠️ **IMPORTANT:** This app uses **REAL cUSD** on Celo Mainnet. Only use funds you can afford to lose.

---

## 🚀 How to Play on MiniPay

### 1. Get Setup (First Time Only)
1. Download **Opera Mini** (with MiniPay) or **Valora** app on your phone
2. Open your wallet and ensure you're on **Celo Mainnet**
3. Get **REAL cUSD** from:
   - Buy directly in MiniPay or Valora
   - Bridge from another network
   - Exchange like Binance, Coinbase
4. Open [https://chessflip-celo-mainet.vercel.app/](https://chessflip-celo-mainet.vercel.app/) in MiniPay browser

⚠️ **This is MAINNET - use real money carefully!**

### 2. Register & Play
1. **Connect Wallet** - Tap "Connect Wallet" and approve connection
2. **Register Username** - Choose a unique username (3-20 characters)
3. **Approve cUSD** - Allow ChessFlip to use your cUSD (one-time approval)
4. **Start Game** - Pay **0.001 cUSD** entry fee to begin
5. **Match Pairs** - Flip cards to find 6 matching chess piece pairs
6. **Earn Points** - Win: **+10 points** | Lose: **+2 points**
7. **Claim Rewards** - Return to lobby and claim your points!

### 3. Compete
- Check the **Leaderboard** to see top players
- Play more games to increase your rank
- All scores are stored on-chain!

---

## 💰 Costs

| Action | Cost |
|--------|------|
| Registration | **Free** ✅ |
| Start Game | **0.001 cUSD** |
| Claim Points | **Free** ✅ |
| View Leaderboard | **Free** ✅ |

*Only gas fees apply (very low on Celo)*

---

## 🎯 Game Rules

- **Grid:** 3×4 cards (12 cards total)
- **Pairs:** 6 matching chess piece pairs to find
- **Lives:** Start with 5 lives, lose 1 per wrong match
- **Win Condition:** Match all 6 pairs before losing all lives
- **Scoring:**
  - ✅ **Win:** 10 points
  - ❌ **Lose/Surrender:** 2 points

---

## 🖥️ Run Locally

Want to test on your computer? Follow these steps:

### Prerequisites
- [Node.js 18+](https://nodejs.org/) installed
- [Git](https://git-scm.com/) installed

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/Akanimoh12/chessflip-celo.git
cd chessflip-celo/frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser
# Visit: http://localhost:5173
```

The app will connect to Celo Sepolia testnet automatically. No configuration needed!

---

## 🎮 Play on Farcaster

**ChessFlip is also available as a Farcaster MiniApp!**

### How to Play in Farcaster

1. **Open Warpcast App** on your mobile device
2. **Enable MiniApps:**
   - Go to Settings → Advanced → Mini Apps
   - Enable "Developer Mode" (if testing)
3. **Launch ChessFlip:**
   - Search for "ChessFlip" in MiniApps directory, OR
   - Enter URL: `https://chessflip-celo-mainet.vercel.app`
4. **Connect & Play:**
   - App loads directly in Farcaster
   - Connect your wallet (Celo network)
   - Register with your Farcaster username
   - Start playing!

### Farcaster Features
- ✅ **Share to Cast:** Share your wins directly to Farcaster
- ✅ **Haptic Feedback:** Feel every flip and match (mobile)
- ✅ **Seamless UX:** No browser navigation needed
- ✅ **Quick Auth:** Authenticate with your Farcaster identity

**Manifest:** [View manifest.json](https://chessflip-celo-mainet.vercel.app/manifest.json)

---

## 🔗 Links

- **Live App:** [chessflip-celo-mainet.vercel.app](https://chessflip-celo-mainet.vercel.app/)
- **Contract on CeloScan:** [View Contract](https://celoscan.io/address/0xEb2b130c0846a2C183b56b49FE472e0D2a87f124)
- **Farcaster MiniApp:** Search "ChessFlip" in Warpcast
- **GitHub:** [Akanimoh12/chessflip-celo](https://github.com/Akanimoh12/chessflip-celo)

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Web3:** wagmi v2, RainbowKit, viem
- **Blockchain:** Celo Mainnet
- **Smart Contract:** Solidity 0.8.24, OpenZeppelin
- **MiniApp:** Farcaster SDK (@farcaster/miniapp-sdk)

---

## ❓ Troubleshooting

**Can't connect wallet?**
- Make sure you're using MiniPay browser (inside Opera Mini or Valora app)
- Try disconnecting and reconnecting your wallet

**Transaction failed?**
- Check you have enough cUSD in your wallet (REAL cUSD on mainnet)
- Ensure you have approved cUSD spending for the contract

**Claim button disabled?**
- You need to complete at least one game first
- Make sure the game result was submitted successfully

**Need help?**
- Open an issue on [GitHub](https://github.com/Akanimoh12/chessflip-celo/issues)

---

## 📜 License

MIT License - feel free to fork and build upon this project!

---

**Ready to play?** 🎮 [Launch ChessFlip Now →](https://chessflip-celo-mainet.vercel.app/)
