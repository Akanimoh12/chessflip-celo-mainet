import { Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { LobbyPage } from '@/pages/LobbyPage';
import { GamePage } from '@/pages/GamePage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { NetworkDebug } from '@/components/NetworkDebug';

function App() {
  return (
    <>
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

