import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { AppShell } from './components/AppShell';
import { LandingPage } from './components/LandingPage';
import { GameSetup } from './components/GameSetup';
import { ArchiveDashboard } from './components/ArchiveDashboard';
import { HeroFilePuzzle } from './components/HeroFilePuzzle';
import { PowerSequence } from './components/PowerSequence';
import { DoomLock } from './components/DoomLock';
import { VictoryScreen } from './components/VictoryScreen';
import { TimeExpiredScreen } from './components/TimeExpiredScreen';

const GameRouter: React.FC = () => {
  const { gameState } = useGame();

  switch (gameState.screen) {
    case 'landing':
      return <LandingPage />;
    case 'setup':
      return <GameSetup />;
    case 'dashboard':
      return <ArchiveDashboard />;
    case 'heroFile':
      return <HeroFilePuzzle />;
    case 'powerSequence':
      return <PowerSequence />;
    case 'doomLock':
      return <DoomLock />;
    case 'victory':
      return <VictoryScreen />;
    case 'timeExpired':
      return <TimeExpiredScreen />;
    default:
      return <LandingPage />;
  }
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <AppShell>
        <GameRouter />
      </AppShell>
    </GameProvider>
  );
};

export default App;
