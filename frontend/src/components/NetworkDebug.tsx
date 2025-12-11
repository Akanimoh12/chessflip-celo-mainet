// Network status component for debugging
import { useAccount, useChainId } from 'wagmi';
import { celo, celoSepolia } from '@/config/celo';
import { useEffect } from 'react';

export const NetworkDebug = () => {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const contractAddress = import.meta.env.VITE_CHESSFLIP_CONTRACT_ADDRESS;
  const expectedNetwork = import.meta.env.VITE_DEFAULT_NETWORK === 'mainnet' ? celo : celoSepolia;
  const isMainnet = chainId === celo.id;
  const isCorrectNetwork = chainId === expectedNetwork.id;

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
    <div className="fixed bottom-4 left-4 p-4 bg-secondary border-2 border-primary rounded-brutalist text-xs font-mono z-50 max-w-xs">
      <div className="font-bold mb-2 text-brand">🔧 Debug Info</div>
      <div>Connected: {isConnected ? '✅' : '❌'}</div>
      <div>Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}</div>
      <div>Chain: {chain?.name || 'Unknown'}</div>
      <div>Chain ID: {chainId || 'None'}</div>
      <div>Expected: {expectedNetwork.id} ({expectedNetwork.name})</div>
      <div className={isCorrectNetwork ? 'text-green-400' : 'text-red-400'}>
        Network Match: {isCorrectNetwork ? '✅' : '❌ WRONG NETWORK'}
      </div>
      {isMainnet && (
        <div className="text-yellow-400 font-bold">🔴 MAINNET (REAL MONEY)</div>
      )}
      <div>Contract: {contractAddress ? '✅' : '❌'}</div>
      {contractAddress && (
        <div className="text-[10px] break-all">{contractAddress}</div>
      )}
    </div>
  );
};
