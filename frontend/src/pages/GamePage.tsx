import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import toast from 'react-hot-toast';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Navbar } from '@/components/organisms/Navbar';
import { Trophy, ArrowLeft, RotateCcw } from 'lucide-react';
import { chessFlipAbi } from '@/abi/chessFlip';
import type { Address } from 'viem';

const contractAddress = import.meta.env.VITE_CHESSFLIP_CONTRACT_ADDRESS as Address;

// Chess piece emojis
const chessPieces = ['♔', '♕', '♖', '♗', '♘', '♙'];

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface CardType {
  id: number;
  piece: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function GamePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');
  
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameStartTime] = useState(Date.now());
  const [gameTime, setGameTime] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

  const [isSubmittingResult, setIsSubmittingResult] = useState(false);

  // Submit game result to contract
  const { data: submitHash, writeContract: submitResult } = useWriteContract();
  const { isSuccess: isSubmitSuccess } = useWaitForTransactionReceipt({
    hash: submitHash,
  });

  // Initialize game
  useEffect(() => {
    const pairs = chessPieces.flatMap((piece, index) => [
      { id: index * 2, piece, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, piece, isFlipped: false, isMatched: false },
    ]);
    setCards(shuffleArray(pairs));
  }, []);

  // Game timer
  useEffect(() => {
    if (isGameWon) return;
    
    const interval = setInterval(() => {
      setGameTime(Math.floor((Date.now() - gameStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStartTime, isGameWon]);

  // Check for win
  useEffect(() => {
    if (matches === 6 && !isGameWon && !isSubmittingResult) {
      setIsGameWon(true);
      // Submit win result to contract
      if (gameId && contractAddress) {
        setIsSubmittingResult(true);
        toast.loading('Submitting game result...', { id: 'submit-result' });
        submitResult({
          address: contractAddress,
          abi: chessFlipAbi,
          functionName: 'submitGameResult',
          args: [BigInt(gameId), 1, 6, 5], // outcome=1 (Win), matchedPairs=6, livesRemaining=5
        });
      }
    }
  }, [matches, isGameWon, isSubmittingResult, gameId, submitResult]);

  // Handle submit success
  useEffect(() => {
    if (isSubmitSuccess && gameId) {
      toast.success('🎉 Game result submitted! +10 points', { id: 'submit-result' });
      setIsSubmittingResult(false);
      
      // Store the gameId in localStorage for claiming later
      localStorage.setItem('lastCompletedGameId', gameId);
    }
  }, [isSubmitSuccess, gameId]);

  const handleCardClick = (id: number) => {
    // Don't allow more than 2 flips or clicking already matched/flipped cards
    if (
      isChecking ||
      flippedCards.length >= 2 ||
      flippedCards.includes(id) ||
      cards.find(c => c.id === id)?.isMatched
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // Update card state
    setCards(cards.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    ));

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      setIsChecking(true);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard?.piece === secondCard?.piece) {
        // Match found!
        setTimeout(() => {
          setCards(cards.map(card =>
            newFlippedCards.includes(card.id)
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(matches + 1);
          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards(cards.map(card =>
            newFlippedCards.includes(card.id)
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const handleRestart = () => {
    const pairs = chessPieces.flatMap((piece, index) => [
      { id: index * 2, piece, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, piece, isFlipped: false, isMatched: false },
    ]);
    setCards(shuffleArray(pairs));
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsGameWon(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/lobby')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lobby
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Memory Match</h1>
              <p className="text-primary/70">Match all 6 pairs to win!</p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-3">
              <Badge variant="default" size="md">
                ⏱️ {formatTime(gameTime)}
              </Badge>
              <Badge variant="default" size="md">
                🎯 Moves: {moves}
              </Badge>
              <Badge variant="brand" size="md">
                ✨ {matches}/6
              </Badge>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <Card variant="default" className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={isChecking || card.isMatched}
                  className={`
                    aspect-square rounded-brutalist border-4 border-primary
                    flex items-center justify-center text-6xl
                    transition-all duration-300 transform
                    hover:scale-105 active:scale-95
                    ${card.isFlipped || card.isMatched
                      ? 'bg-accent'
                      : 'bg-brand hover:bg-brand/80 cursor-pointer'
                    }
                    ${card.isMatched ? 'opacity-60 scale-95' : ''}
                    ${isChecking ? 'cursor-not-allowed' : ''}
                  `}
                >
                  {(card.isFlipped || card.isMatched) ? card.piece : '?'}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Win Modal */}
        {isGameWon && (
          <Card variant="default" className="border-brand bg-brand/5">
            <CardHeader className="border-b-3 border-brand pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand/20 border-3 border-brand rounded-brutalist flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-brand" />
                </div>
                <CardTitle className="text-2xl">Congratulations! 🎉</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <p className="text-lg">
                  You matched all pairs in <span className="font-bold text-brand">{moves} moves</span> and <span className="font-bold text-brand">{formatTime(gameTime)}</span>!
                </p>
                <p className="text-primary/70">
                  You earned <span className="font-bold text-brand">10 points</span>! Return to lobby to claim your rewards.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="brand"
                  size="lg"
                  onClick={() => navigate('/lobby')}
                  className="flex-1"
                >
                  Back to Lobby
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleRestart}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!isGameWon && (
          <Card variant="flat" className="bg-primary/5">
            <CardContent className="p-4">
              <h3 className="font-bold mb-2">How to Play:</h3>
              <ul className="text-sm text-primary/70 space-y-1">
                <li>• Click cards to flip them and reveal chess pieces</li>
                <li>• Match pairs of identical pieces</li>
                <li>• Win by matching all 6 pairs</li>
                <li>• Try to complete in as few moves as possible!</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
