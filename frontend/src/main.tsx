import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Toaster } from 'react-hot-toast';
import { wagmiConfig } from './config/celo';
import { initializeFarcasterSDK } from './config/farcaster';
import App from './App';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';

const queryClient = new QueryClient();

// Initialize Farcaster SDK after render
const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RainbowKitProvider modalSize="compact">
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '3px solid #FF6B9D',
                  borderRadius: '0.375rem',
                  fontWeight: '600',
                },
                success: {
                  iconTheme: {
                    primary: '#FF6B9D',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </RainbowKitProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);

// CRITICAL: Call sdk.actions.ready() to hide Farcaster splash screen
// This must be called after the app renders to avoid infinite loading
// The SDK handles whether we're in a MiniApp context automatically
initializeFarcasterSDK().catch(console.error);

