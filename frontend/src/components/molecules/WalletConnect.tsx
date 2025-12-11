import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/atoms';
import { Icon } from '@/components/atoms/Icon';
import { AlertTriangle, Loader2, Wallet } from 'lucide-react';

export const WalletConnectButton = () => (
  <ConnectButton.Custom>
    {({
      account,
      chain,
      openAccountModal,
      openChainModal,
      openConnectModal,
      authenticationStatus,
      mounted,
    }) => {
      const ready = mounted && authenticationStatus !== 'loading';
      const connected =
        ready &&
        account &&
        chain &&
        (!authenticationStatus || authenticationStatus === 'authenticated');

      if (!ready) {
        return (
          <Button
            variant="brand"
            size="md"
            disabled
            className="min-w-[200px] justify-center"
            type="button"
          >
            <Icon icon={Loader2} size="sm" variant="secondary" className="animate-spin" />
            Connecting...
          </Button>
        );
      }

      if (!connected) {
        return (
          <Button
            variant="brand"
            size="md"
            className="min-w-[200px] justify-center"
            onClick={openConnectModal}
            type="button"
          >
            <Icon icon={Wallet} size="sm" variant="secondary" />
            Connect Wallet
          </Button>
        );
      }

      if (chain?.unsupported) {
        return (
          <Button
            variant="brand"
            size="md"
            className="min-w-[200px] justify-center"
            onClick={openChainModal}
            type="button"
          >
            <Icon icon={AlertTriangle} size="sm" variant="secondary" />
            Switch Network
          </Button>
        );
      }

      return (
        <Button
          variant="brand"
          size="md"
          className="min-w-[200px] justify-center"
          onClick={openAccountModal}
          type="button"
        >
          <Icon icon={Wallet} size="sm" variant="secondary" />
          {account.displayName}
        </Button>
      );
    }}
  </ConnectButton.Custom>
);

WalletConnectButton.displayName = 'WalletConnectButton';
