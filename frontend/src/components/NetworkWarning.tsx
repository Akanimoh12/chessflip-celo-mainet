// Network mismatch warning for production
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { celo } from '@/config/celo';
import { Button } from '@/components/atoms/Button';
import { AlertTriangle } from 'lucide-react';

export const NetworkWarning = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isMainnet = chainId === celo.id;

  // Only show warning if connected and not on Celo Mainnet
  if (!isConnected || isMainnet) return null;

  const handleSwitchNetwork = () => {
    try {
      switchChain?.({ chainId: celo.id });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div>
            <div className="font-bold">Wrong Network Detected</div>
            <div className="text-sm">
              Please switch to <strong>Celo Mainnet</strong> to use ChessFlip
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleSwitchNetwork}
          variant="secondary"
          size="sm"
          className="bg-white text-red-600 hover:bg-gray-100"
          disabled={!switchChain}
        >
          Switch to Celo Mainnet
        </Button>
      </div>
    </div>
  );
};
