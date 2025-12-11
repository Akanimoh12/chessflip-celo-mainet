import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { sdk } from '@farcaster/miniapp-sdk';
import { LandingPage } from '@/pages/LandingPage';
import { LobbyPage } from '@/pages/LobbyPage';
import { GamePage } from '@/pages/GamePage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { NetworkDebug } from '@/components/NetworkDebug';
import { NetworkWarning } from '@/components/NetworkWarning';
import { isInMiniApp } from '@/utils/farcaster';

function App() {
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    // Detect if running in Farcaster MiniApp
    setIsMiniApp(isInMiniApp());
    
    if (isInMiniApp()) {
      console.log('🎯 Running in Farcaster MiniApp');
    }

    // Fallback: Ensure ready() is called when App component mounts
    // This provides a second opportunity if main.tsx call was missed
    const callReady = async () => {
      try {
        await sdk.actions.ready();
        console.log('✅ sdk.actions.ready() called from App component');
      } catch (error) {
        console.log('ℹ️ sdk.actions.ready() already called or not needed');
      }
    };
    callReady();
  }, []);

  return (
    <>
      {/* Show Farcaster badge if in MiniApp */}
      {isMiniApp && (
        <div className="fixed top-0 right-0 z-50 bg-purple-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg shadow-lg">
          🎭 Farcaster
        </div>
      )}
      
      <NetworkWarning />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <NetworkDebug />
    </>
  );
}

export default App;

