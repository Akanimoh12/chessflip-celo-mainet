import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/atoms';
import { cn } from '@/utils/cn';

// Chess piece symbols matching GamePlayPage
const CHESS_PIECES = ['♔', '♕', '♖', '♗', '♘', '♙'];

interface GameCard {
  id: number;
  piece: string;
  isFlipped: boolean;
  pairId: number;
}

interface GamePreviewProps {
  /** Show cards in flipped state (for demo purposes) */
  showPieces?: boolean;
  /** Disable interactions (static preview) */
  interactive?: boolean;
  /** Custom title */
  title?: string;
  /** Show game stats */
  showStats?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * GamePreview - Responsive game board preview component
 * 
 * Features:
 * - Fisher-Yates shuffle algorithm (matches GamePlayPage logic)
 * - Mobile-first responsive grid (3x4 on mobile, 4x3 on desktop)
 * - Brutalist design system integration
 * - Interactive or static mode
 * - Scales typography for all screen sizes
 */
export const GamePreview = ({
  showPieces = false,
  interactive = false,
  title = 'Game preview',
  showStats = true,
  className,
}: GamePreviewProps) => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  /**
   * Fisher-Yates shuffle algorithm
   * Ensures random but fair card distribution
   * Same implementation as GamePlayPage for consistency
   */
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize and shuffle cards on mount
  useEffect(() => {
    const gameCards: GameCard[] = [];
    let cardId = 0;

    // Create pairs of cards (2 of each piece)
    for (const piece of CHESS_PIECES) {
      const pairId = CHESS_PIECES.indexOf(piece);
      for (let i = 0; i < 2; i++) {
        gameCards.push({
          id: cardId++,
          piece,
          isFlipped: showPieces,
          pairId,
        });
      }
    }

    // Apply Fisher-Yates shuffle
    const shuffledCards = shuffleArray(gameCards);
    setCards(shuffledCards);
  }, [showPieces]);

  // Handle card click in interactive mode
  const handleCardClick = (cardId: number) => {
    if (!interactive) return;

    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  return (
    <Card variant="default" className={cn('border-primary shadow-brutalist-lg', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg md:text-xl">{title}</CardTitle>
          {showStats && (
            <Badge variant="secondary" size="sm" className="text-xs sm:text-sm">
              {CHESS_PIECES.length} pairs
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Responsive grid: 3 cols mobile, 4 cols tablet+ */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
          {cards.map((card) => {
            const isFlipped = showPieces || flippedCards.has(card.id);
            
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={!interactive}
                className={cn(
                  'aspect-square rounded-brutalist border-3 border-primary',
                  'flex items-center justify-center',
                  'transition-all duration-300',
                  'text-2xl sm:text-3xl md:text-4xl font-semibold',
                  isFlipped
                    ? 'bg-accent text-primary'
                    : 'bg-primary text-secondary',
                  interactive && 'hover:scale-105 hover:shadow-brutal-sm cursor-pointer active:scale-95',
                  !interactive && 'cursor-default'
                )}
                aria-label={isFlipped ? `Chess piece ${card.piece}` : 'Hidden card'}
              >
                {isFlipped ? card.piece : '?'}
              </button>
            );
          })}
        </div>

        {/* Game stats - mobile optimized typography */}
        {showStats && (
          <div className="flex items-center justify-between text-xs sm:text-sm text-primary/70 pt-2">
            <span className="font-medium">Match 3 pairs to win</span>
            <Badge variant="brand" size="sm" className="text-xs">
              0.001 cUSD
            </Badge>
          </div>
        )}

        {/* Interactive mode indicator */}
        {interactive && (
          <p className="text-xs sm:text-sm text-center text-primary/60 pt-1">
            Tap cards to flip • Preview mode only
          </p>
        )}
      </CardContent>
    </Card>
  );
};
