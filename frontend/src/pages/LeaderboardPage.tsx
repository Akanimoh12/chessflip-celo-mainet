import { useState, useEffect } from 'react';
import { useBlockNumber, usePublicClient, useAccount } from 'wagmi';
import { Navbar } from '@/components/organisms/Navbar';
import { WalletConnectButton, ShareToFarcaster } from '@/components/molecules';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Trophy, Medal, Award, TrendingUp, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { chessFlipAbi } from '@/abi/chessFlip';
import type { Address } from 'viem';

const contractAddress = import.meta.env.VITE_CHESSFLIP_CONTRACT_ADDRESS as Address;

// Deployment blocks for different networks
const DEPLOYMENT_BLOCKS: Record<number, bigint> = {
  42220: 53549328n,    // Celo Mainnet - Dec 11, 2025
  11142220: 0n,        // Celo Sepolia Testnet
};

// Cache configuration
const CACHE_KEY = 'chessflip_leaderboard_cache';
const CACHE_DURATION = 60 * 1000; // 1 minute
const MAX_LEADERBOARD_SIZE = 100; // Only show top 100 players

interface PlayerData {
  address: Address;
  username: string;
  totalPoints: number;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
}

interface CachedLeaderboard {
  players: PlayerData[];
  timestamp: number;
  lastBlock: string;
}

export function LeaderboardPage() {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredAddresses, setRegisteredAddresses] = useState<Address[]>([]);
  const [lastFetchedBlock, setLastFetchedBlock] = useState<bigint>(0n);
  const [userRank, setUserRank] = useState<number | null>(null);

  
  // Get current block number - but don't watch continuously
  useBlockNumber({ watch: false });

  // Calculate user's rank whenever players or address changes
  useEffect(() => {
    if (address && players.length > 0) {
      const rank = players.findIndex(p => p.address.toLowerCase() === address.toLowerCase()) + 1;
      setUserRank(rank > 0 ? rank : null);
    } else {
      setUserRank(null);
    }
  }, [address, players]);

  // Load from cache on mount for instant display
  useEffect(() => {
    const loadFromCache = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const data: CachedLeaderboard = JSON.parse(cached);
          const age = Date.now() - data.timestamp;
          
          if (age < CACHE_DURATION) {
            console.log(`✅ Loaded cached leaderboard (${Math.floor(age / 1000)}s old)`);
            setPlayers(data.players);
            setLastFetchedBlock(BigInt(data.lastBlock));
            setIsLoading(false);
            return true;
          }
          console.log(`⏰ Cache expired (${Math.floor(age / 1000)}s old), fetching fresh data`);
        }
      } catch (error) {
        console.error('Cache load error:', error);
      }
      return false;
    };

    // Try to show cached data immediately
    if (!loadFromCache()) {
      setIsLoading(true);
    }
  }, []);

  // Fetch all PlayerRegistered events (with incremental updates)
  useEffect(() => {
    const fetchRegisteredPlayers = async () => {
      if (!publicClient || !contractAddress) return;

      try {
        setIsLoading(true);
        
        const chainId = await publicClient.getChainId();
        const deploymentBlock = DEPLOYMENT_BLOCKS[chainId] || 0n;
        const currentBlock = await publicClient.getBlockNumber();
        
        // Incremental update: only fetch new events since last fetch
        const fromBlock = lastFetchedBlock > 0n ? lastFetchedBlock + 1n : deploymentBlock;
        
        console.log(`📊 Fetching events from block ${fromBlock} to ${currentBlock} (chain ${chainId})`);
        
        // Get PlayerRegistered events from contract deployment
        const logs = await publicClient.getLogs({
          address: contractAddress,
          event: {
            type: 'event',
            name: 'PlayerRegistered',
            inputs: [
              { name: 'player', type: 'address', indexed: true },
              { name: 'username', type: 'string', indexed: false },
            ],
          },
          fromBlock: fromBlock,
          toBlock: 'latest',
        });

        console.log(`Found ${logs.length} new PlayerRegistered events`);

        // Extract new unique addresses
        const newAddresses = [...new Set(logs.map(log => log.args.player as Address))];
        
        // Merge with existing addresses (for incremental updates)
        const allAddresses = [...new Set([...registeredAddresses, ...newAddresses])];
        
        console.log(`Total players: ${allAddresses.length} (+${newAddresses.length} new)`);
        setRegisteredAddresses(allAddresses);
        setLastFetchedBlock(currentBlock);

      } catch (error) {
        console.error('Error fetching registered players:', error);
        setIsLoading(false);
      }
    };

    // Fetch when we have no addresses or when explicitly refreshing
    if (publicClient && registeredAddresses.length === 0 && isLoading) {
      fetchRegisteredPlayers();
    }
  }, [publicClient, contractAddress, isLoading, registeredAddresses.length, lastFetchedBlock]);

  // Fetch player data for all registered addresses
  useEffect(() => {
    const fetchPlayersData = async () => {
      if (registeredAddresses.length === 0 || !publicClient) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching data for', registeredAddresses.length, 'players...');
        
        const playerDataPromises = registeredAddresses.map(async (address) => {
          try {
            const result = await publicClient.readContract({
              address: contractAddress,
              abi: chessFlipAbi,
              functionName: 'getPlayer',
              args: [address],
            });

            // Cast result properly
            const playerData = result as unknown as {
              username: string;
              totalPoints: bigint;
              totalGames: number;
              wins: number;
              losses: number;
              unclaimedPoints: bigint;
              registered: boolean;
            };
            
            const { username, totalPoints, totalGames, wins, losses, unclaimedPoints, registered } = playerData;

            console.log(`Player ${address}:`, { 
              username, 
              registered, 
              totalPoints: Number(totalPoints),
              unclaimedPoints: Number(unclaimedPoints),
              totalGames: Number(totalGames),
              usernameLength: username.length
            });

            // Check if player is registered and has a username
            if (!registered) {
              console.log(`Player ${address} not registered`);
              return null;
            }
            
            if (!username || username.trim() === '') {
              console.log(`Player ${address} has empty username`);
              return null;
            }

            const gamesCount = Number(totalGames);
            const winsCount = Number(wins);
            
            return {
              address,
              username,
              totalPoints: Number(totalPoints),
              totalGames: gamesCount,
              wins: winsCount,
              losses: Number(losses),
              winRate: gamesCount > 0 ? (winsCount / gamesCount) * 100 : 0,
            } as PlayerData;
          } catch (error) {
            console.error(`Error fetching player ${address}:`, error);
            return null;
          }
        });

        const results = await Promise.all(playerDataPromises);
        const validPlayers = results.filter((p): p is PlayerData => p !== null);
        
        console.log(`Found ${validPlayers.length} valid players`);
        
        // Sort by total points descending and take top 100 only
        validPlayers.sort((a, b) => b.totalPoints - a.totalPoints);
        const topPlayers = validPlayers.slice(0, MAX_LEADERBOARD_SIZE);
        
        console.log(`📈 Showing top ${topPlayers.length} of ${validPlayers.length} players`);
        
        setPlayers(topPlayers);
        
        // Cache the results
        try {
          const cacheData: CachedLeaderboard = {
            players: topPlayers,
            timestamp: Date.now(),
            lastBlock: lastFetchedBlock.toString(),
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
          console.log('💾 Leaderboard cached');
        } catch (error) {
          console.error('Cache save error:', error);
        }
      } catch (error) {
        console.error('Error fetching players data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (registeredAddresses.length > 0) {
      fetchPlayersData();
    }
  }, [registeredAddresses, publicClient, lastFetchedBlock]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh - clearing cache and fetching latest data');
    // Clear cache
    localStorage.removeItem(CACHE_KEY);
    // Reset state to trigger full refresh
    setLastFetchedBlock(0n);
    setRegisteredAddresses([]);
    setIsLoading(true);
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-primary/50">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar>
        <WalletConnectButton />
      </Navbar>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand/20 border-3 border-brand rounded-brutalist flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-brand" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Leaderboard</h1>
              <p className="text-lg text-primary/70 max-w-2xl mx-auto">
                Top {MAX_LEADERBOARD_SIZE} players ranked by total points. Compete to reach the top!
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card variant="default" className="border-brand bg-brand/5">
            <CardContent className="p-6 text-center">
              {isLoading ? (
                <Skeleton className="h-10 w-16 mx-auto mb-1" />
              ) : (
                <div className="text-3xl font-bold text-brand mb-1">{players.length}</div>
              )}
              <div className="text-sm text-primary/70">Total Players</div>
            </CardContent>
          </Card>
          <Card variant="default" className="border-primary">
            <CardContent className="p-6 text-center">
              {isLoading ? (
                <Skeleton className="h-10 w-16 mx-auto mb-1" />
              ) : (
                <div className="text-3xl font-bold text-primary mb-1">
                  {players.reduce((sum, p) => sum + p.totalGames, 0)}
                </div>
              )}
              <div className="text-sm text-primary/70">Games Played</div>
            </CardContent>
          </Card>
          <Card variant="default" className="border-primary">
            <CardContent className="p-6 text-center">
              {isLoading ? (
                <Skeleton className="h-10 w-16 mx-auto mb-1" />
              ) : (
                <div className="text-3xl font-bold text-primary mb-1">
                  {players.reduce((sum, p) => sum + p.totalPoints, 0)}
                </div>
              )}
              <div className="text-sm text-primary/70">Total Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <Card variant="default">
          <CardHeader className="border-b-3 border-primary">
            <CardTitle className="text-2xl">Rankings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-brutalist" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : players.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-primary/70">No players yet. Be the first to register!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary/5 border-b-2 border-primary">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">
                        Player
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-primary uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-primary uppercase tracking-wider">
                        Games
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-primary uppercase tracking-wider">
                        Wins
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-primary uppercase tracking-wider">
                        Win Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-primary/20">
                    {players.map((player, index) => (
                      <tr
                        key={player.address}
                        className={`hover:bg-primary/5 transition-colors ${
                          index < 3 ? 'bg-brand/5' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getMedalIcon(index + 1)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand/20 border-2 border-primary rounded-brutalist flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">
                                {player.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-primary">{player.username}</div>
                              <div className="text-xs text-primary/50">{player.address}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Badge variant="brand" size="sm">
                            {player.totalPoints} pts
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center font-semibold">
                          {player.totalGames}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center font-semibold text-green-600">
                          {player.wins}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="font-semibold">
                            {player.winRate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Button - Show if user is in top 10 */}
        {userRank && userRank <= 10 && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-sm text-primary/70">
              You're ranked <strong className="text-brand">#{userRank}</strong> on the leaderboard! 🎉
            </p>
            <ShareToFarcaster 
              type="leaderboard" 
              data={{ rank: userRank }} 
            />
          </div>
        )}

        {/* Info Card */}
        <Card variant="flat" className="mt-8 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-bold mb-3 text-lg">How Rankings Work</h3>
            <ul className="space-y-2 text-sm text-primary/70">
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">•</span>
                <span>Players are ranked by <strong className="text-primary">total points earned</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">•</span>
                <span>Win a game: <strong className="text-primary">+10 points</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">•</span>
                <span>Lose a game: <strong className="text-primary">+2 points</strong> (participation reward)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">•</span>
                <span>Win rate shows your success percentage across all games</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
