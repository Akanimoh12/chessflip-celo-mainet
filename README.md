# ChessFlip 🎮♟️

**A blockchain-based memory matching game on Celo. Match chess pieces, earn points, and compete on the leaderboard.**

Play with cUSD on MiniPay, Valora, or any Celo wallet. No email signup required.

---

## 🎮 Play Now

**Live App:** [https://chessflip-celo.vercel.app/](https://chessflip-celo.vercel.app/)

**Network:** Celo Sepolia Testnet  
**Contract:** [`0xEb2b130c0846a2C183b56b49FE472e0D2a87f124`](https://celo-sepolia.blockscout.com/address/0xEb2b130c0846a2C183b56b49FE472e0D2a87f124)

---

## 🚀 How to Play on MiniPay

### 1. Get Setup (First Time Only)
1. Download **Opera Mini** or **Valora** app on your phone
2. Open **MiniPay** (built into Opera Mini) or **Valora** wallet
3. Get free test cUSD from [Celo Faucet](https://faucet.celo.org/alfajores) - switch to Sepolia testnet
4. Open [https://chessflip-celo.vercel.app/](https://chessflip-celo.vercel.app/) in MiniPay browser

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

## 🔗 Links

- **Live App:** [chessflip-celo.vercel.app](https://chessflip-celo.vercel.app/)
- **Contract on Blockscout:** [View Contract](https://celo-sepolia.blockscout.com/address/0xEb2b130c0846a2C183b56b49FE472e0D2a87f124)
- **Celo Faucet:** [Get Test cUSD](https://faucet.celo.org/alfajores) *(Select Sepolia)*
- **GitHub:** [Akanimoh12/chessflip-celo](https://github.com/Akanimoh12/chessflip-celo)

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Web3:** wagmi v2, RainbowKit, viem
- **Blockchain:** Celo Sepolia Testnet
- **Smart Contract:** Solidity 0.8.24, OpenZeppelin

---

## ❓ Troubleshooting

**Can't connect wallet?**
- Make sure you're using MiniPay browser (inside Opera Mini or Valora app)
- Try disconnecting and reconnecting your wallet

**Transaction failed?**
- Check you have enough cUSD in your wallet
- Get test cUSD from [Celo Faucet](https://faucet.celo.org/alfajores)

**Claim button disabled?**
- You need to complete at least one game first
- Make sure the game result was submitted successfully

**Need help?**
- Open an issue on [GitHub](https://github.com/Akanimoh12/chessflip-celo/issues)

---

## 📜 License

MIT License - feel free to fork and build upon this project!

---

**Ready to play?** 🎮 [Launch ChessFlip Now →](https://chessflip-celo.vercel.app/)
