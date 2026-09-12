import { useEffect, useState } from 'react';
import { GameOver } from './components/GameOver';
import { PlayerSetup } from './components/PlayerSetup';
import { RoundInput } from './components/RoundInput';
import { Scoreboard } from './components/Scoreboard';
import { ScoreTracker } from './components/ScoreTracker';
import { useGame } from './hooks/useGame';
import { useMultiGameScores } from './hooks/useMultiGameScores';
import { useRoster } from './hooks/useRoster';
import { useVictories } from './hooks/useVictories';

type AppScreen = 'play' | 'scores';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('play');
  const { recordVictories, getWins, leaderboard } = useVictories();
  const { roster, updateRoster } = useRoster();
  const multiGame = useMultiGameScores();
  const { state, actions } = useGame({ onRecordVictories: recordVictories });

  // Keep Scores roster in sync with an in-progress Flip7 session (e.g. after refresh).
  useEffect(() => {
    if (state.players.length >= 2 && roster.length === 0) {
      updateRoster(state.players.map((player) => player.name));
    }
  }, [state.players, roster.length, updateRoster]);

  const handleNewGame = () => {
    if (
      state.phase === 'setup' ||
      window.confirm('Start a new game? Current progress will be lost.')
    ) {
      actions.newGame();
    }
  };

  const handleStartGame = (playerNames: string[]) => {
    updateRoster(playerNames);
    actions.startGame(playerNames);
  };

  return (
    <div className="app">
      <header className="app-header">
        <nav className="app-nav" aria-label="Main">
          <button
            type="button"
            className={`app-nav-btn${screen === 'play' ? ' app-nav-btn--active' : ''}`}
            onClick={() => setScreen('play')}
            aria-current={screen === 'play' ? 'page' : undefined}
          >
            Play
          </button>
          <button
            type="button"
            className={`app-nav-btn${screen === 'scores' ? ' app-nav-btn--active' : ''}`}
            onClick={() => setScreen('scores')}
            aria-current={screen === 'scores' ? 'page' : undefined}
          >
            Scores
          </button>
        </nav>
        {screen === 'play' && state.phase !== 'setup' && (
          <button type="button" className="btn btn-ghost" onClick={handleNewGame}>
            New Game
          </button>
        )}
        {screen === 'scores' && <span className="app-title">Scores</span>}
      </header>

      <main className={`app-main${screen === 'scores' ? ' app-main--tracker' : ''}`}>
        {screen === 'scores' && (
          <ScoreTracker
            players={roster}
            games={multiGame.games}
            activeGame={multiGame.activeGame}
            wins={multiGame.wins}
            onIncrement={multiGame.increment}
            onDecrement={multiGame.decrement}
            onFlipGame={multiGame.flipGame}
            onAddGame={multiGame.createGame}
          />
        )}

        {screen === 'play' && state.phase === 'setup' && (
          <PlayerSetup
            onStart={handleStartGame}
            leaderboard={leaderboard}
            getWins={getWins}
            initialNames={roster}
          />
        )}

        {screen === 'play' && state.phase === 'playing' && (
          <>
            <Scoreboard players={state.players} round={state.round} getWins={getWins} />
            <RoundInput
              players={state.players}
              roundScores={state.roundScores}
              onScoreChange={actions.setRoundScore}
              onFinishRound={actions.finishRound}
            />
          </>
        )}

        {screen === 'play' && state.phase === 'gameOver' && state.winner && (
          <>
            <Scoreboard players={state.players} round={state.round} getWins={getWins} />
            <GameOver
              winner={state.winner}
              getWins={getWins}
              onNewGame={actions.newGame}
              onPlayAgain={actions.playAgain}
            />
          </>
        )}
      </main>
    </div>
  );
}
