import { useState, useEffect } from 'react';
import { useBlockNumber, usePublicClient } from 'wagmi';
import { Navbar } from '@/components/organisms/Navbar';
import { WalletConnectButton } from '@/components/molecules';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Trophy, Medal, Award, TrendingUp, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { chessFlipAbi } from '@/abi/chessFlip';
import type { Address } from 'viem';

const contractAddress = import.meta.env.VITE_CHESSFLIP_CONTRACT_ADDRESS as Address;

interface PlayerData {
  address: Address;
  username: string;
  totalPoints: number;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
}

export function LeaderboardPage() {
  const publicClient = usePublicClient();
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredAddresses, setRegisteredAddresses] = useState<Address[]>([]);

  
  // Get current block number - but don't watch continuously
  useBlockNumber({ watch: false });

  // Fetch all PlayerRegistered events (only once on mount and manual refresh)
  useEffect(() => {
    const fetchRegisteredPlayers = async () => {
      if (!publicClient || !contractAddress) return;

      try {
        setIsLoading(true);
        
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
          fromBlock: 0n,
          toBlock: 'latest',
        });

        console.log('Found PlayerRegistered events:', logs.length);

        // Extract unique addresses
        const addresses = [...new Set(logs.map(log => log.args.player as Address))];
        console.log('Registered addresses:', addresses);
        setRegisteredAddresses(addresses);

      } catch (error) {
        console.error('Error fetching registered players:', error);
        setIsLoading(false);
      }
    };

    // Only fetch on initial mount
    if (registeredAddresses.length === 0) {
      fetchRegisteredPlayers();
    }
  }, [publicClient, contractAddress]); // Removed blockNumber from dependencies

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
        
        console.log('Valid players:', validPlayers);
        
        // Sort by total points descending
        validPlayers.sort((a, b) => b.totalPoints - a.totalPoints);
        setPlayers(validPlayers);
      } catch (error) {
        console.error('Error fetching players data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayersData();
  }, [registeredAddresses, publicClient]); // Removed blockNumber

  const handleRefresh = async () => {
    setIsLoading(true);
    setRegisteredAddresses([]); // Clear to trigger re-fetch
    
    // Wait a bit then re-fetch
    setTimeout(() => {
      if (publicClient && contractAddress) {
        publicClient.getLogs({
          address: contractAddress,
          event: {
            type: 'event',
            name: 'PlayerRegistered',
            inputs: [
              { name: 'player', type: 'address', indexed: true },
              { name: 'username', type: 'string', indexed: false },
            ],
          },
          fromBlock: 0n,
          toBlock: 'latest',
        }).then(logs => {
          const addresses = [...new Set(logs.map(log => log.args.player as Address))];
          setRegisteredAddresses(addresses);
        }).catch(error => {
          console.error('Error refreshing:', error);
          setIsLoading(false);
        });
      }
    }, 100);
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
                Top players ranked by total points earned. Compete to reach the top!
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
