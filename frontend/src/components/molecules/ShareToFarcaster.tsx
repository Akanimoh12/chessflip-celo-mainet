import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Share2 } from 'lucide-react';
import { isInMiniApp } from '@/utils/farcaster';
import { sdk } from '@farcaster/miniapp-sdk';

interface ShareProps {
  type: 'win' | 'leaderboard' | 'achievement';
  data: {
    score?: number;
    rank?: number;
    message?: string;
  };
}

export const ShareToFarcaster = ({ type, data }: ShareProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const inMiniApp = isInMiniApp();

  const generateShareText = () => {
    switch (type) {
      case 'win':
        return `Just won ChessFlip with ${data.score} points! 🎮♟️\n\nPlay now on Celo`;
      case 'leaderboard':
        return `Ranked #${data.rank} on ChessFlip leaderboard! 🏆\n\nCan you beat me?`;
      case 'achievement':
        return data.message || 'Playing ChessFlip on Celo! 🎮';
      default:
        return 'Check out ChessFlip on Celo!';
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    const text = generateShareText();
    const url = 'https://chessflip-celo.vercel.app';

    try {
      if (inMiniApp) {
        // Share via Farcaster MiniApp
        await sdk.actions.openUrl(
          `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(url)}`
        );
      } else {
        // Fallback to Web Share API or clipboard
        if (navigator.share) {
          await navigator.share({ text, url });
        } else {
          await navigator.clipboard.writeText(`${text}\n${url}`);
          alert('Link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={isSharing}
      variant="secondary"
      size="sm"
      className="flex items-center gap-2"
    >
      <Share2 className="w-4 h-4" />
      {inMiniApp ? 'Share to Feed' : 'Share'}
    </Button>
  );
};
