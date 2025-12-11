import { useAccount, useReadContract } from 'wagmi';
import type { Address } from 'viem';
import { chessFlipAbi } from '@/abi/chessFlip';

export interface PlayerData {
  username: string;
  totalPoints: bigint;
  totalGames: bigint;
  wins: bigint;
  losses: bigint;
  unclaimedPoints: bigint;
  registered: boolean;
}

interface UsePlayerReturn {
  player: PlayerData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isRegistered: boolean;
  hasUnclaimedPoints: boolean;
  unclaimedPointsFormatted: string;
  totalPointsFormatted: string;
  winRate: number;
  refetch: () => void;
}

/**
 * Custom hook to fetch and cache player data from ChessFlip contract
 * Uses wagmi's useReadContract with TanStack Query under the hood
 * 
 * @returns Player data with computed properties and refetch function
 */
export const usePlayer = (): UsePlayerReturn => {
  const { address, isConnected } = useAccount();
  const contractAddress = import.meta.env.VITE_CHESSFLIP_CONTRACT_ADDRESS as Address | undefined;

  const {
    data: rawPlayer,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    abi: chessFlipAbi,
    address: contractAddress,
    functionName: 'getPlayer',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(contractAddress && address && isConnected),
      // Cache for 30 seconds - balance freshness vs RPC calls
      staleTime: 30_000,
      // Keep in cache for 5 minutes when unused
      gcTime: 5 * 60 * 1000,
      // Refetch on window focus for up-to-date unclaimed points
      refetchOnWindowFocus: true,
      // Retry failed requests up to 3 times
      retry: 3,
    },
  });

  // Type assertion for contract return value
  const player = rawPlayer as unknown as PlayerData | undefined;

  // Computed values
  const isRegistered = Boolean(player?.registered);
  const hasUnclaimedPoints = Boolean(player?.unclaimedPoints && player.unclaimedPoints > 0n);

  // Format bigint values to readable strings
  const formatPoints = (value?: bigint): string => {
    if (!value) return '0';
    return Number(value).toLocaleString();
  };

  const unclaimedPointsFormatted = formatPoints(player?.unclaimedPoints);
  const totalPointsFormatted = formatPoints(player?.totalPoints);

  // Calculate win rate percentage
  const winRate = (() => {
    if (!player || player.totalGames === 0n) return 0;
    const total = Number(player.totalGames);
    const wins = Number(player.wins);
    return Math.round((wins / total) * 100);
  })();

  return {
    player,
    isLoading,
    isError,
    error: error as Error | null,
    isRegistered,
    hasUnclaimedPoints,
    unclaimedPointsFormatted,
    totalPointsFormatted,
    winRate,
    refetch: () => void refetch(),
  };
};
