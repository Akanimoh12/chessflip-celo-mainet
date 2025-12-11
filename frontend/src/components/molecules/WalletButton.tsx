import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atoms/Button';

interface WalletButtonProps {
  className?: string;
}

export const WalletButton = ({ className }: WalletButtonProps) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  const displayAddress = isConnected && address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : 'Connect Wallet';

  const handleClick = () => {
    if (!isConnected) {
      openConnectModal?.();
    } else {
      disconnect();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={isConnected ? 'secondary' : 'primary'}
      className={cn('flex items-center gap-2', className)}
    >
      <span>{displayAddress}</span>
    </Button>
  );
};

WalletButton.displayName = 'WalletButton';
