import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  valoraWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { celo as celoMainnet } from "viem/chains";
import { createConfig, http } from "wagmi";
import { defineChain } from "viem";

// Re-export for use in components
export { celo as celoMainnet } from "viem/chains";
export const celo = celoMainnet;

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "";

if (!projectId && import.meta.env.DEV) {
  console.warn("⚠️ WalletConnect project ID is not configured. MiniPay will not connect without it.");
}

// Define Celo Sepolia testnet
export const celoSepolia = defineChain({
  id: 11142220,
  name: 'Celo Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo-sepolia.celo-testnet.org'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'CeloScan', 
      url: 'https://celo-sepolia.blockscout.com',
      apiUrl: 'https://api-alfajores.celoscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1,
    },
  },
  testnet: true,
});

// Prioritize mainnet over testnet for production
export const celoChains = [celo, celoSepolia] as const;

const miniPayWallet = (options: Parameters<typeof walletConnectWallet>[0]) => {
  const wallet = walletConnectWallet(options);
  return {
    ...wallet,
    id: "miniPay",
    name: "MiniPay",
    iconUrl: "https://minipay.opera.com/img/minipay-icon.png",
    iconBackground: "#111111",
    downloadUrls: {
      android: "https://play.google.com/store/apps/details?id=com.opera.browser",
      ios: "https://apps.apple.com/app/opera-mini-web-browser/id363729560",
      mobile: "https://minipay.opera.com",
    },
  };
};

// Farcaster MiniApp connector
const farcasterWallet = () => ({
  id: "farcaster",
  name: "Farcaster",
  iconUrl: "https://warpcast.com/apple-touch-icon.png",
  iconBackground: "#8A63D2",
  createConnector: farcasterMiniApp,
});

const walletGroups = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        farcasterWallet,  // Farcaster MiniApp - first for priority in MiniApp
        miniPayWallet,
        valoraWallet,
        metaMaskWallet,
        coinbaseWallet,
      ],
    },
  ],
  {
    appName: "ChessFlip",
    projectId,
  }
);

export const wagmiConfig = createConfig({
  chains: celoChains,
  transports: {
    [celo.id]: http(
      import.meta.env.VITE_CELO_MAINNET_RPC_URL ?? celo.rpcUrls.default.http[0]
    ),
    [celoSepolia.id]: http(
      import.meta.env.VITE_CELO_SEPOLIA_RPC_URL ?? 
        'https://forno.celo-sepolia.celo-testnet.org'
    ),
  },
  connectors: walletGroups,
  ssr: false,
});

export const CUSD_ADDRESSES = {
  [celo.id]: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  [celoSepolia.id]: "0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b", // Updated to match deployed contract
};

export const ENTRY_FEE_CUSD = "0.001";
