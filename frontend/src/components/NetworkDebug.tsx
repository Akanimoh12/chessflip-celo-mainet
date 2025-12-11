// Network status component for debugging
import { useAccount, useChainId } from 'wagmi';
import { celoSepolia } from '@/config/celo';

export const NetworkDebug = () => {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const contractAddress = import.meta.env.VITE_CHESSFLIP_CONTRACT_ADDRESS;

  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-secondary border-2 border-primary rounded-brutalist text-xs font-mono z-50 max-w-xs">
      <div className="font-bold mb-2 text-brand">🔧 Debug Info</div>
      <div>Connected: {isConnected ? '✅' : '❌'}</div>
      <div>Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}</div>
      <div>Chain: {chain?.name || 'Unknown'}</div>
      <div>Chain ID: {chainId || 'None'}</div>
      <div>Expected: {celoSepolia.id} (Celo Sepolia)</div>
      <div className={chainId === celoSepolia.id ? 'text-green-400' : 'text-red-400'}>
        Network Match: {chainId === celoSepolia.id ? '✅' : '❌ WRONG NETWORK'}
      </div>
      <div>Contract: {contractAddress ? '✅' : '❌'}</div>
      {contractAddress && (
        <div className="text-[10px] break-all">{contractAddress}</div>
      )}
    </div>
  );
};
