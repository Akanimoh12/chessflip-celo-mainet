import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId } from 'wagmi';
import { parseUnits, type Address } from 'viem';
import toast from 'react-hot-toast';
import { Navbar, Footer } from '@/components/organisms';
import { WalletConnectButton, RegistrationModal } from '@/components/molecules';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/atoms';
import { Icon } from '@/components/atoms/Icon';
import { ArrowRightCircle, Coins, RefreshCcw } from 'lucide-react';
import { usePlayer } from '@/hooks/usePlayer';
import { useFarcasterAuth } from '@/hooks/useFarcasterAuth';
import { chessFlipAbi } from '@/abi/chessFlip';
import { CUSD_ADDRESSES } from '@/config/celo';

// ERC20 ABI for approve function
const erc20Abi = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
] as const;

export const LobbyPage = () => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [lastCompletedGameId, setLastCompletedGameId] = useState<string | null>(null);
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  
  const contractAddress = import.meta.env.VITE_CHESSFLIP_CONTRACT_ADDRESS as Address | undefined;
  const cUsdAddress = CUSD_ADDRESSES[chainId as keyof typeof CUSD_ADDRESSES] as Address | undefined;

  const {
    player,
    isLoading,
    isRegistered,
    hasUnclaimedPoints,
    unclaimedPointsFormatted,
    totalPointsFormatted,
    winRate,
    refetch,
  } = usePlayer();

  // Farcaster authentication
  const { user: farcasterUser } = useFarcasterAuth();

  // Get last completed game ID from localStorage - refresh on player data update
  useEffect(() => {
    const gameId = localStorage.getItem('lastCompletedGameId');
    
    // If we have unclaimed points but no gameId, assume it's game 1 (legacy games)
    if (!gameId && hasUnclaimedPoints && player?.totalGames) {
      console.log('Setting legacy gameId to 1 for unclaimed points');
      setLastCompletedGameId('1');
    } else {
      setLastCompletedGameId(gameId);
    }
  }, [player, hasUnclaimedPoints]); // Re-check when player data updates

  // Check cUSD allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: cUsdAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address && contractAddress ? [address, contractAddress] : undefined,
    query: {
      enabled: Boolean(address && contractAddress && cUsdAddress),
    },
  });

  // Approve cUSD
  const {
    data: approveHash,
    isPending: isApprovePending,
    writeContract: approveWrite,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Start game
  const {
    data: startGameHash,
    isPending: isStartGamePending,
    writeContract: startGameWrite,
  } = useWriteContract();

  const { isLoading: isStartGameConfirming, isSuccess: isStartGameSuccess } = useWaitForTransactionReceipt({
    hash: startGameHash,
  });

  // Claim points
  const {
    data: claimHash,
    isPending: isClaimPending,
    writeContract: claimWrite,
  } = useWriteContract();

  const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  // Handle approve success
  useEffect(() => {
    if (isApproveSuccess) {
      toast.success('✅ Approved! Click "Start New Match" again to play', { 
        id: 'approve',
        duration: 5000 
      });
      setIsStartingGame(false);
      
      // Refetch allowance after a short delay
      setTimeout(() => {
        refetchAllowance();
      }, 1000);
    }
  }, [isApproveSuccess, refetchAllowance]);

  // Handle start game success
  const navigate = useNavigate();
  useEffect(() => {
    if (isStartGameSuccess && startGameHash) {
      toast.success('Game started! 🎮', { id: 'startGame' });
      setIsStartingGame(false);
      
      // Get the gameId from the transaction receipt
      const getGameId = async () => {
        try {
          // Wait a bit for the transaction to be mined
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // For now, we'll navigate without gameId and add it later from contract events
          // In production, you'd decode the transaction logs to get the gameId
          navigate('/game?gameId=1'); // TODO: Get actual gameId from transaction logs
          refetch();
        } catch (error) {
          console.error('Error getting game ID:', error);
          navigate('/game');
        }
      };
      
      getGameId();
    }
  }, [isStartGameSuccess, startGameHash, refetch, navigate]);

  // Handle claim success
  useEffect(() => {
    if (isClaimSuccess) {
      toast.success('Rewards claimed! 💰', { id: 'claim' });
      // Clear the completed game ID after claiming
      localStorage.removeItem('lastCompletedGameId');
      setLastCompletedGameId(null);
      refetch();
    }
  }, [isClaimSuccess, refetch]);

  // Handle claim confirming
  useEffect(() => {
    if (isClaimConfirming) {
      toast.loading('Confirming claim...', { id: 'claim' });
    }
  }, [isClaimConfirming]);

  const handleStartGame = async () => {
    if (!contractAddress || !cUsdAddress || !address) {
      toast.error('Configuration error. Please refresh.');
      return;
    }

    setIsStartingGame(true);
    const minAllowance = parseUnits('0.002', 18); // Minimum 2 games worth
    const approvalAmount = parseUnits('1', 18); // Approve 1 cUSD (1000 games worth)

    try {
      // Check if we need approval (less than 2 games)
      const currentAllowance = allowance || BigInt(0);
      
      if (currentAllowance < minAllowance) {
        // Need approval first - approve a larger amount for multiple games
        toast.loading('Please approve cUSD spending in your wallet...', { id: 'approve' });
        approveWrite({
          address: cUsdAddress,
          abi: erc20Abi,
          functionName: 'approve',
          args: [contractAddress, approvalAmount], // Approve 1 cUSD for ~1000 games
        });
      } else {
        // Already approved, start game directly
        toast.loading('Starting game...', { id: 'startGame' });
        startGameWrite({
          address: contractAddress,
          abi: chessFlipAbi,
          functionName: 'startGame',
        });
      }
    } catch (error) {
      console.error('Start game error:', error);
      toast.error('Failed to start game. Please try again.');
      setIsStartingGame(false);
    }
  };

  const handleClaimRewards = () => {
    if (!contractAddress) {
      toast.error('Configuration error. Please refresh.');
      return;
    }

    if (!lastCompletedGameId) {
      toast.error('No completed games to claim. Play a game first!');
      return;
    }

    try {
      toast.loading('Claiming rewards...', { id: 'claim' });
      claimWrite({
        address: contractAddress,
        abi: chessFlipAbi,
        functionName: 'claimPoints',
        args: [BigInt(lastCompletedGameId)],
      });
    } catch (error) {
      console.error('Claim error:', error);
      toast.error('Failed to claim rewards. Please try again.');
    }
  };

  const getStatusLabel = () => {
    if (!isConnected) return 'Connect wallet to continue';
    if (isLoading) return 'Loading your profile...';
    if (isRegistered) return 'Ready to play';
    return 'Create your username';
  };

  const statusLabel = getStatusLabel();
  
  // Show simple message when wallet not connected
  if (!isConnected) {
    return (
      <>
        <Navbar>
          <WalletConnectButton />
        </Navbar>
        <main className="min-h-screen bg-secondary text-primary flex items-center justify-center px-4">
          <Card variant="default" className="max-w-md w-full border-primary text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to ChessFlip</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-primary/70">
                Connect your wallet to start playing and earning cUSD rewards.
              </p>
              <WalletConnectButton />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar>
        <WalletConnectButton />
      </Navbar>

      <main className="min-h-screen bg-secondary text-primary">
        <section className="px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-10">
            <header className="space-y-4 text-center md:text-left">
              <Badge variant="brand" size="sm" className="mx-auto md:mx-0 w-fit">
                Game Lobby
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold">
                {isRegistered ? 'Ready to play!' : 'Get started with ChessFlip'}
              </h1>
              <p className="text-base md:text-lg text-primary/70">
                {isRegistered 
                  ? 'Start a new match or claim your rewards below.'
                  : 'Create your username to unlock matches and rewards.'}
              </p>
            </header>

            {/* Farcaster Profile Card */}
            {farcasterUser && (
              <Card variant="default" className="border-purple-600 bg-purple-50/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {farcasterUser.pfpUrl && (
                      <img 
                        src={farcasterUser.pfpUrl} 
                        alt="Farcaster Profile"
                        className="w-16 h-16 rounded-full border-3 border-purple-600"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-primary">{farcasterUser.displayName}</h3>
                        <Badge variant="brand" size="sm" className="bg-purple-600">
                          Farcaster
                        </Badge>
                      </div>
                      <p className="text-sm text-primary/70">@{farcasterUser.username}</p>
                      <p className="text-xs text-primary/60 mt-1">FID: {farcasterUser.fid}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            <Card variant="default" className="border-primary">
              <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl md:text-3xl">
                      {isRegistered ? `Welcome back, ${player?.username}!` : 'Your Profile'}
                    </CardTitle>
                  </div>
                  <p className="text-sm md:text-base text-primary/70">{statusLabel}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isRegistered && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => refetch()}
                      className="flex items-center gap-2"
                      type="button"
                    >
                      <Icon icon={RefreshCcw} size="sm" variant="primary" />
                      Refresh
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {isRegistered && player && (
                  <>
                    <div className="space-y-2">
                      <p className="text-xs text-primary/60 uppercase tracking-wide font-semibold">Total Games</p>
                      <p className="text-2xl md:text-3xl font-bold">{Number(player.totalGames)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-primary/60 uppercase tracking-wide font-semibold">Win Rate</p>
                      <p className="text-2xl md:text-3xl font-bold text-green-600">{winRate}%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-primary/60 uppercase tracking-wide font-semibold">Total Points</p>
                      <p className="text-2xl md:text-3xl font-bold">{totalPointsFormatted}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-primary/60 uppercase tracking-wide font-semibold">Unclaimed</p>
                      <p className="text-2xl md:text-3xl font-bold text-brand">
                        {unclaimedPointsFormatted}
                        {hasUnclaimedPoints && <span className="ml-2 text-lg">💰</span>}
                      </p>
                    </div>
                  </>
                )}
                {!isRegistered && (
                  <div className="sm:col-span-2 lg:col-span-4 text-center py-8 space-y-3">
                    <p className="text-lg text-primary/70">Create your username to start tracking your stats and earning rewards!</p>
                    <Badge variant="brand" size="sm">Entry fee: 0.001 cUSD per match (⚠️ Real money)</Badge>
                  </div>
                )}
              </CardContent>
            </Card>



            {!isRegistered ? (
              // Registration CTA for new users
              <Card variant="default" className="border-brand bg-brand/5">
                <CardContent className="py-12 text-center space-y-6">
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto bg-brand/20 border-4 border-brand rounded-brutalist flex items-center justify-center">
                      <Icon icon={ArrowRightCircle} size="lg" variant="brand" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">Create Your Username</h2>
                    <p className="text-base md:text-lg text-primary/70 max-w-md mx-auto">
                      Choose a unique username to unlock matches and start earning cUSD rewards.
                    </p>
                  </div>
                  <Button
                    variant="brand"
                    size="lg"
                    onClick={() => setShowRegistrationModal(true)}
                    type="button"
                    className="text-lg px-8"
                  >
                    Create Username
                  </Button>
                </CardContent>
              </Card>
            ) : (
              // Action cards for registered users
              <div className="grid gap-6 md:grid-cols-2">
                <Card variant="default" className="border-primary">
                  <CardHeader className="border-b-3 border-primary pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-accent border-3 border-primary rounded-brutalist flex items-center justify-center">
                        <Icon icon={Coins} size="lg" variant="primary" />
                      </div>
                      <CardTitle className="text-2xl">Start Match</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary/70">Entry Fee</span>
                        <Badge variant="brand" size="sm">0.001 cUSD</Badge>
                      </div>
                      {allowance !== undefined && allowance >= parseUnits('0.002', 18) && (
                        <div className="text-xs text-green-600 font-semibold">
                          ✓ Approved for ~{Math.floor(Number(allowance) / 1e15)} games
                        </div>
                      )}
                      <p className="text-primary/70">
                        Pay the entry fee and match all 6 pairs to win 10 points. Lose and still earn 2 points!
                      </p>
                      {allowance !== undefined && allowance < parseUnits('0.002', 18) && (
                        <p className="text-xs text-amber-600 font-medium">
                          ⚠️ First click: Approve cUSD (~1000 games). Second click: Start game
                        </p>
                      )}
                      <div className="mt-3 p-2 bg-yellow-100 border-2 border-yellow-600 rounded-brutalist">
                        <p className="text-xs font-bold text-yellow-700">
                          ⚠️ MAINNET: Uses REAL cUSD. Only play with funds you can afford to lose.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="brand"
                      size="lg"
                      className="w-full text-lg"
                      onClick={handleStartGame}
                      disabled={isStartingGame || isApprovePending || isApproveConfirming || isStartGamePending || isStartGameConfirming}
                      type="button"
                    >
                      {(isApprovePending || isApproveConfirming) ? 'Approving cUSD...' :
                       (isStartGamePending || isStartGameConfirming) ? 'Starting Game...' :
                       'Start New Match'}
                    </Button>
                  </CardContent>
                </Card>

                <Card variant="default" className={hasUnclaimedPoints ? 'border-brand bg-brand/5' : 'border-primary'}>
                  <CardHeader className="border-b-3 border-primary pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 border-3 border-primary rounded-brutalist flex items-center justify-center ${hasUnclaimedPoints ? 'bg-brand/20' : 'bg-accent'}`}>
                        <Icon icon={Coins} size="lg" variant={hasUnclaimedPoints ? 'brand' : 'primary'} />
                      </div>
                      <CardTitle className="text-2xl">Claim Rewards</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary/70">Available to claim</span>
                        <p className="text-3xl font-bold text-brand">{unclaimedPointsFormatted}</p>
                      </div>
                      <p className="text-primary/70">
                        {hasUnclaimedPoints && lastCompletedGameId
                          ? 'Your rewards are ready! Click below to claim your points.'
                          : hasUnclaimedPoints
                          ? 'Loading game information...'
                          : 'No rewards available yet. Play and complete matches to earn points!'}
                      </p>
                      {lastCompletedGameId && hasUnclaimedPoints && (
                        <p className="text-xs text-green-600 font-semibold">
                          ✓ Game #{lastCompletedGameId} ready to claim
                        </p>
                      )}
                    </div>
                    <Button
                      variant="brand"
                      size="lg"
                      className="w-full text-lg"
                      disabled={!hasUnclaimedPoints || !lastCompletedGameId || isClaimPending || isClaimConfirming}
                      onClick={handleClaimRewards}
                      type="button"
                    >
                      {(isClaimPending || isClaimConfirming) ? 'Claiming...' :
                       hasUnclaimedPoints && lastCompletedGameId ? `Claim ${unclaimedPointsFormatted} Points` : 
                       hasUnclaimedPoints ? 'Loading...' : 'No Rewards Yet'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Footer */}
      <Footer />
    </>
  );
};
