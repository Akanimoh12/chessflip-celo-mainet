import { useState, useEffect } from 'react';
import { Button, Card, Spinner } from '@/components/atoms';
import { ArrowLeft, Heart } from 'lucide-react';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/utils/cn';

// Chess piece symbols for the game
const CHESS_PIECES = ['♔', '♕', '♖', '♗', '♘', '♙'];

interface GameCard {
  id: number;
  piece: string;
  isFlipped: boolean;
  isMatched: boolean;
  pairId: number;
}

interface GamePlayPageProps {
  username: string;
  totalPoints: number;
  gameId: string;
  onBack: () => void;
  onGameEnd: (result: 'win' | 'loss', pointsEarned: number) => void;
  onClaimPoints: (pointsEarned: number) => void;
}

export const GamePlayPage = ({
  username,
  totalPoints,
  gameId,
  onBack,
  onGameEnd,
  onClaimPoints,
}: GamePlayPageProps) => {
  // Game state
  const [cards, setCards] = useState<GameCard[]>([]);
  const [lives, setLives] = useState(5);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isGameInitialized, setIsGameInitialized] = useState(false);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize game
  useEffect(() => {
    if (isGameInitialized) return;

    const gameCards: GameCard[] = [];
    let cardId = 0;

    // Create pairs of cards
    for (const piece of CHESS_PIECES) {
      const pairId = CHESS_PIECES.indexOf(piece);
      for (let i = 0; i < 2; i++) {
        gameCards.push({
          id: cardId++,
          piece,
          isFlipped: false,
          isMatched: false,
          pairId,
        });
      }
    }

    // Shuffle the cards
    const shuffledCards = shuffleArray(gameCards);
    setCards(shuffledCards);
    setIsGameInitialized(true);
  }, [isGameInitialized]);

  // Handle card click
  const handleCardClick = async (cardId: number) => {
    if (isProcessing || gameStatus !== 'playing') return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    // Add card to selected
    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    // Flip the card
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    // If we have 2 cards selected, check for match
    if (newSelected.length === 2) {
      setIsProcessing(true);
      
      const card1 = cards.find((c) => c.id === newSelected[0])!;
      const card2 = cards.find((c) => c.id === newSelected[1])!;

      // Add delay to show both cards
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (card1.pairId === card2.pairId) {
        // Match found!
        setCards((prev) =>
          prev.map((c) =>
            c.id === newSelected[0] || c.id === newSelected[1]
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          )
        );

        const newMatchedPairs = matchedPairs + 1;
        setMatchedPairs(newMatchedPairs);

        // Check for win
        if (newMatchedPairs === CHESS_PIECES.length) {
          const points = 10;
          setPointsEarned(points);
          setGameStatus('won');
          onGameEnd('win', points);
        }
      } else {
        // No match - flip cards back
        setCards((prev) =>
          prev.map((c) =>
            c.id === newSelected[0] || c.id === newSelected[1]
              ? { ...c, isFlipped: false }
              : c
          )
        );

        // Decrement lives
        const newLives = lives - 1;
        setLives(newLives);

        // Check for loss
        if (newLives === 0) {
          const points = 2;
          setPointsEarned(points);
          setGameStatus('lost');
          onGameEnd('loss', points);
        }
      }

      setSelectedCards([]);
      setIsProcessing(false);
    }
  };

  // Handle surrender
  const handleSurrender = () => {
    const points = 2;
    setPointsEarned(points);
    setGameStatus('lost');
    onGameEnd('loss', points);
  };

  // Handle quit
  const handleQuit = () => {
    onBack();
  };

  // Handle claim points
  const handleClaimPoints = () => {
    onClaimPoints(pointsEarned);
    onBack();
  };

  if (!isGameInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="md"
            onClick={handleQuit}
            disabled={isProcessing || gameStatus !== 'playing'}
            className="flex items-center gap-sm"
          >
            <Icon icon={ArrowLeft} size="md" />
            Back
          </Button>

          <div className="text-center">
            <p className="text-sm text-primary/70">Username</p>
            <p className="text-lg font-bold text-primary">{username}</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-primary/70">Total Points</p>
            <p className="text-lg font-bold text-primary">{totalPoints}</p>
          </div>
        </div>

        {/* Game Content */}
        {gameStatus === 'playing' ? (
          <>
            {/* Game Grid */}
            <div className="bg-white border-3 border-primary rounded-brutalist p-6 mb-6">
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={
                      isProcessing ||
                      card.isFlipped ||
                      card.isMatched ||
                      selectedCards.includes(card.id)
                    }
                    className={cn(
                      'aspect-square border-3 border-primary rounded-brutalist font-bold text-3xl sm:text-4xl',
                      'transition-all duration-150 flex items-center justify-center',
                      'disabled:cursor-not-allowed',
                      card.isFlipped || card.isMatched
                        ? 'bg-brand text-secondary shadow-brutalist'
                        : 'bg-accent text-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
                    )}
                  >
                    {card.isFlipped || card.isMatched ? card.piece : '?'}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Bar */}
            <div className="flex gap-4 mb-6 flex-wrap justify-center">
              {/* Lives */}
              <Card variant="default" padding="sm" className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const isAlive = i < lives;
                    return (
                      <div key={`heart-${lives}-${i}`}>
                        <Heart
                          className={cn('w-6 h-6', isAlive ? 'text-brand' : 'text-primary/30')}
                        />
                      </div>
                    );
                  })}
                </div>
                <span className="text-sm font-medium text-primary">{lives} Lives</span>
              </Card>

              {/* Matched Pairs */}
              <Card variant="default" padding="sm">
                <span className="text-sm font-medium text-primary">
                  {matchedPairs}/6 Pairs Matched
                </span>
              </Card>

              {/* Game ID */}
              <Card variant="default" padding="sm">
                <span className="text-xs font-mono text-primary/70">
                  Game: {gameId.slice(0, 8)}
                </span>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                variant="secondary"
                size="md"
                onClick={handleSurrender}
                disabled={isProcessing}
              >
                Surrender
              </Button>
            </div>
          </>
        ) : (
          /* Result Screen */
          <div className="max-w-md mx-auto">
            <Card variant="elevated" padding="lg" className="text-center space-y-6">
              <div>
                <div className="text-6xl mb-4">
                  {gameStatus === 'won' ? '🎉' : '😢'}
                </div>
                <h2 className="text-4xl font-bold text-primary mb-2">
                  {gameStatus === 'won' ? 'YOU WON!' : 'YOU LOST!'}
                </h2>
                <p className="text-sm text-primary/70">
                  {gameStatus === 'won'
                    ? 'Congratulations! You matched all pairs.'
                    : 'Better luck next time!'}
                </p>
              </div>

              <div className="bg-accent border-3 border-primary rounded-brutalist p-4">
                <p className="text-sm text-primary/70 mb-1">Points Earned</p>
                <p className="text-4xl font-bold text-brand">{pointsEarned}</p>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  variant="brand"
                  size="lg"
                  onClick={handleClaimPoints}
                  className="w-full"
                >
                  Claim Points & Continue
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleQuit}
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

GamePlayPage.displayName = 'GamePlayPage';
