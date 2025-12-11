// Network status component for debugging
import { useAccount, useChainId } from 'wagmi';
import { celo, celoSepolia } from '@/config/celo';
import { useEffect } from 'react';
import { useFarcasterAuth } from '@/hooks/useFarcasterAuth';
import { isInMiniApp } from '@/utils/farcaster';

export const NetworkDebug = () => {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { user: farcasterUser } = useFarcasterAuth();
  const contractAddress = import.meta.env.VITE_CHESSFLIP_CONTRACT_ADDRESS;
  const expectedNetwork = import.meta.env.VITE_DEFAULT_NETWORK === 'mainnet' ? celo : celoSepolia;
  const isMainnet = chainId === celo.id;
  const isCorrectNetwork = chainId === expectedNetwork.id;
  const inMiniApp = isInMiniApp();

  // Warn in console if on wrong network in production
  useEffect(() => {
    if (import.meta.env.PROD && isConnected && !isCorrectNetwork) {
      console.warn('⚠️ WARNING: Connected to wrong network!');
      console.warn(`Expected: ${expectedNetwork.name} (${expectedNetwork.id})`);
      console.warn(`Current: ${chain?.name || 'Unknown'} (${chainId})`);
    }

    // Warn if on testnet in production build
    if (import.meta.env.PROD && isConnected && !isMainnet) {
      console.warn('⚠️ WARNING: Connected to TESTNET in production build!');
    }
  }, [isConnected, chainId, isCorrectNetwork, isMainnet, expectedNetwork, chain]);

  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-secondary border-2 border-primary rounded-brutalist text-xs font-mono z-50 max-w-xs shadow-lg">
      <div className="font-bold mb-2 text-brand">🔧 Debug Info</div>
      
      {/* Farcaster Status */}
      <div className="mb-2 pb-2 border-b border-primary/20">
        <div className="font-semibold text-purple-600">Farcaster:</div>
        <div>Environment: {inMiniApp ? '✅ MiniApp' : '🌐 Web'}</div>
        {farcasterUser && (
          <>
            <div>FID: {farcasterUser.fid}</div>
            <div>User: @{farcasterUser.username}</div>
          </>
        )}
      </div>

      {/* Wallet Status */}
      <div className="mb-2 pb-2 border-b border-primary/20">
        <div className="font-semibold">Wallet:</div>
        <div>Connected: {isConnected ? '✅' : '❌'}</div>
        <div>Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}</div>
      </div>

      {/* Network Status */}
      <div className="mb-2 pb-2 border-b border-primary/20">
        <div className="font-semibold">Network:</div>
        <div>Chain: {chain?.name || 'Unknown'}</div>
        <div>Chain ID: {chainId || 'None'}</div>
        <div>Expected: {expectedNetwork.id} ({expectedNetwork.name})</div>
        <div className={isCorrectNetwork ? 'text-green-400' : 'text-red-400'}>
          Match: {isCorrectNetwork ? '✅' : '❌ WRONG NETWORK'}
        </div>
        {isMainnet && (
          <div className="text-yellow-400 font-bold mt-1">🔴 MAINNET (REAL MONEY)</div>
        )}
      </div>

      {/* Contract Status */}
      <div>
        <div className="font-semibold">Contract:</div>
        <div>Status: {contractAddress ? '✅' : '❌ Not configured'}</div>
        {contractAddress && (
          <div className="text-[10px] break-all mt-1">{contractAddress}</div>
        )}
      </div>
    </div>
  );
};
