import type { Abi } from 'viem';

export const chessFlipAbi = [
  {
    type: 'function',
    stateMutability: 'view',
    name: 'getPlayer',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    outputs: [
      {
        internalType: 'struct ChessFlip.Player',
        type: 'tuple',
        components: [
          { name: 'username', internalType: 'string', type: 'string' },
          { name: 'totalPoints', internalType: 'uint64', type: 'uint64' },
          { name: 'totalGames', internalType: 'uint32', type: 'uint32' },
          { name: 'wins', internalType: 'uint32', type: 'uint32' },
          { name: 'losses', internalType: 'uint32', type: 'uint32' },
          { name: 'unclaimedPoints', internalType: 'uint64', type: 'uint64' },
          { name: 'registered', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'registerPlayer',
    inputs: [{ name: 'username', internalType: 'string', type: 'string' }],
    outputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'startGame',
    inputs: [],
    outputs: [{ name: 'gameId', internalType: 'uint256', type: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'getGame',
    inputs: [{ name: 'gameId', internalType: 'uint256', type: 'uint256' }],
    outputs: [
      {
        internalType: 'struct ChessFlip.Game',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'player', internalType: 'address', type: 'address' },
          { name: 'outcome', internalType: 'uint8', type: 'uint8' },
          { name: 'matchedPairs', internalType: 'uint8', type: 'uint8' },
          { name: 'livesRemaining', internalType: 'uint8', type: 'uint8' },
          { name: 'createdAt', internalType: 'uint64', type: 'uint64' },
          { name: 'updatedAt', internalType: 'uint64', type: 'uint64' },
          { name: 'pointsAwarded', internalType: 'uint64', type: 'uint64' },
          { name: 'claimed', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'submitGameResult',
    inputs: [
      { name: 'gameId', internalType: 'uint256', type: 'uint256' },
      { name: 'outcome', internalType: 'uint8', type: 'uint8' },
      { name: 'matchedPairs', internalType: 'uint8', type: 'uint8' },
      { name: 'livesRemaining', internalType: 'uint8', type: 'uint8' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'claimPoints',
    inputs: [{ name: 'gameId', internalType: 'uint256', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'event',
    name: 'PlayerRegistered',
    inputs: [
      { name: 'player', internalType: 'address', type: 'address', indexed: true },
      { name: 'username', internalType: 'string', type: 'string', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'GameStarted',
    inputs: [
      { name: 'gameId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'player', internalType: 'address', type: 'address', indexed: true },
    ],
  },
  {
    type: 'event',
    name: 'GameResultSubmitted',
    inputs: [
      { name: 'gameId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'player', internalType: 'address', type: 'address', indexed: true },
      { name: 'outcome', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'matchedPairs', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'livesRemaining', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'pointsAwarded', internalType: 'uint64', type: 'uint64', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'PointsClaimed',
    inputs: [
      { name: 'gameId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'player', internalType: 'address', type: 'address', indexed: true },
      { name: 'pointsAwarded', internalType: 'uint64', type: 'uint64', indexed: false },
    ],
  },
] as const satisfies Abi;
