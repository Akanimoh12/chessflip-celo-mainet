# ChessFlip Smart Contract

Solidity smart contract for ChessFlip - a blockchain-based chess memory game on Celo.

## Features

- Player registration with unique usernames
- Game management (start, play, submit results, claim points)
- Point system: 10 points for wins, 2 points for losses
- Entry fee: 0.001 cUSD per game
- Pausable and owner-controlled
- ReentrancyGuard protection

## Technology Stack

- Solidity ^0.8.24
- Foundry (Forge)
- OpenZeppelin Contracts
- Celo Network

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Private key with CELO for gas fees
- CeloScan API key (optional, for verification)

## Quick Start

### 1. Install Dependencies

```bash
forge install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your PRIVATE_KEY
```

### 3. Build

```bash
forge build
```

### 4. Test

```bash
forge test
```

### 5. Deploy to Celo Mainnet

**Option A: Using deployment script (Recommended)**
```bash
./deploy.sh
# Select option 2 for Celo Mainnet
```

**Option B: Using forge directly**
```bash
forge script script/DeployChessFlip.s.sol:DeployChessFlip \
  --rpc-url celo_mainnet \
  --broadcast \
  --verify \
  -vvvv
```

## Contract Details

### Constructor Parameters
- `cUsdToken`: Address of cUSD token on Celo
  - Mainnet: `0x765DE816845861e75A25fCA122bb6898B8B1282a`
  - Sepolia: `0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b`
- `initialOwner`: Address that will own the contract

### Key Functions

**Player Functions:**
- `registerPlayer(string username)` - Register with unique username (3-20 chars)
- `startGame()` - Start new game (requires 0.001 cUSD)
- `submitGameResult(uint256 gameId, GameOutcome outcome, uint8 matchedPairs, uint8 livesRemaining)` - Submit game result
- `claimPoints(uint256 gameId)` - Claim earned points

**View Functions:**
- `getPlayer(address account)` - Get player stats
- `getGame(uint256 gameId)` - Get game details

**Owner Functions:**
- `pause()` / `unpause()` - Pause/unpause contract
- `withdraw(address to, uint256 amount)` - Withdraw accumulated fees

## Networks

### Celo Mainnet
- Chain ID: 42220
- RPC: https://forno.celo.org
- Explorer: https://celoscan.io

### Celo Sepolia Testnet
- Chain ID: 11142220  
- RPC: https://forno.celo-sepolia.celo-testnet.org
- Explorer: https://celo-sepolia.blockscout.com

## Security

- ReentrancyGuard on all state-changing functions
- Pausable for emergency stops
- Input validation on all user inputs
- Owner-only admin functions

## Post-Deployment

After deploying:

1. **Save contract address** - You'll need it for frontend integration
2. **Verify on block explorer** - Automated if using `--verify` flag
3. **Update frontend** - Add contract address to frontend `.env`
4. **Test all functions** - Register, play, claim with small amounts

## Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Celo Docs](https://docs.celo.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## License

MIT

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
