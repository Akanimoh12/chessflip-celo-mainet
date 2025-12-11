import { useState } from 'react';
import { RegistrationModal } from '@/components/molecules/RegistrationModal';
import { GamePlayPage } from '@/pages/GamePlayPage';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/atoms';
import { ArrowRight } from 'lucide-react';
import { Icon } from '@/components/atoms/Icon';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

/**
 * Integration Example for GamePlayPage & RegistrationModal
 * 
 * This shows how to use both components together in a Dashboard-like page
 */

interface DashboardState {
  isRegistered: boolean;
  username: string;
  totalPoints: number;
  currentGameId: string | null;
  showRegistrationModal: boolean;
  isPlayingGame: boolean;
}

export const GameIntegrationExample = () => {
  const [state, setState] = useState<DashboardState>({
    isRegistered: false,
    username: '',
    totalPoints: 0,
    currentGameId: null,
    showRegistrationModal: false,
    isPlayingGame: false,
  });

  // Handle registration
  const handleRegistration = async () => {
    // Registration completed via modal - just update local state
    setState((prev) => ({
      ...prev,
      isRegistered: true,
      username: 'NewPlayer', // Username comes from contract now
      totalPoints: 0,
      showRegistrationModal: false,
    }));
  };

  // Handle start game
  const handleStartGame = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (state.isRegistered) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // Placeholder: call smart contract startGame function
      // const gameId = await startGame();
      
      setState((prev) => ({
        ...prev,
        isPlayingGame: true,
        currentGameId: `game_${Date.now()}`,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        showRegistrationModal: true,
      }));
    }
  };

  // Handle game end
  const handleGameEnd = (result: 'win' | 'loss', pointsEarned: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // Placeholder: call smart contract submitGameResult function
  // const tx = await submitGameResult(gameId, result, pointsEarned);
    
    console.log(`Game ${result}! Points earned: ${pointsEarned}`);
  };

  // Handle claim points
  const handleClaimPoints = (pointsEarned: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // Placeholder: call smart contract claimPoints function
  // const tx = await claimPoints(pointsEarned);
    
    setState((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + pointsEarned,
      isPlayingGame: false,
      currentGameId: null,
    }));
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    setState((prev) => ({
      ...prev,
      isPlayingGame: false,
      currentGameId: null,
    }));
  };

  // If playing game, show game page
  if (state.isPlayingGame && state.currentGameId) {
    return (
      <GamePlayPage
        username={state.username}
        totalPoints={state.totalPoints}
        gameId={state.currentGameId}
        onBack={handleBackToDashboard}
        onGameEnd={handleGameEnd}
        onClaimPoints={handleClaimPoints}
      />
    );
  }

  // Otherwise show dashboard
  return (
    <div className="min-h-screen bg-secondary px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-primary">ChessFlip</h1>
          <p className="text-lg text-primary/70">
            {state.isRegistered
              ? `Welcome back, ${state.username}!`
              : 'Ready to play?'}
          </p>
        </div>

        {/* User Stats (if registered) */}
        {state.isRegistered && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Username</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-brand">{state.username}</p>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle>Total Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-brand">{state.totalPoints}</p>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle>Games Played</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-brand">0</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          <Button
            variant="brand"
            size="lg"
            onClick={handleStartGame}
            className="flex items-center gap-2 mx-auto"
          >
            {state.isRegistered ? 'Start New Game' : 'Get Started'}
            <Icon icon={ArrowRight} size="md" />
          </Button>
        </div>

        {/* Info Section */}
        <Card variant="default" className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-primary/70 text-sm">
            <p>
              ♞ <strong>Flip cards</strong> to match pairs of chess pieces
            </p>
            <p>
              ❤️ <strong>Manage your lives</strong> - you get 5 attempts per game
            </p>
            <p>
              🎯 <strong>Match all 6 pairs</strong> to win and earn 10 points
            </p>
            <p>
              💰 <strong>Each game costs 0.001 cUSD</strong> and losses still earn 2 consolation points
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={state.showRegistrationModal}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            showRegistrationModal: false,
          }))
        }
        onSuccess={handleRegistration}
      />
    </div>
  );
};

/**
 * Usage Instructions:
 * 
 * 1. Import this component in your routing/app file:
 *    import { GameIntegrationExample } from '@/pages/GameIntegrationExample';
 * 
 * 2. Use it as a page or integrate the pattern into your Dashboard:
 *    <Route path="/dashboard" element={<GameIntegrationExample />} />
 * 
 * 3. Connect smart contract functions (example TODOs in code):
 *    - registerPlayer: Register username and create PlayerProfile
 *    - startGame: Initialize ChessFlipGame object
 *    - submitGameResult: Update game status and calculate points
 *    - claimPoints: Add points to PlayerProfile
 * 
 * 4. The component handles:
 *    - Registration modal triggering
 *    - Game state management
 *    - Navigation between dashboard and game
 *    - Points display
 * 
 * Component Tree:
 * GameIntegrationExample (state management)
 *   ├── RegistrationModal (when not registered and clicking "Start")
 *   └── GamePlayPage (when game is active)
 *       └── Card grid with flip mechanics
 */
