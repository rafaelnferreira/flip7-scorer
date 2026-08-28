import { GameOver } from './components/GameOver';
import { PlayerSetup } from './components/PlayerSetup';
import { RoundInput } from './components/RoundInput';
import { Scoreboard } from './components/Scoreboard';
import { useGame } from './hooks/useGame';

export default function App() {
  const { state, actions } = useGame();

  const handleNewGame = () => {
    if (
      state.phase === 'setup' ||
      window.confirm('Start a new game? Current progress will be lost.')
    ) {
      actions.newGame();
    }
  };

  return (
    <div className="app">
      {state.phase !== 'setup' && (
        <header className="app-header">
          <span className="app-title">Flip7 Scorer</span>
          <button type="button" className="btn btn-ghost" onClick={handleNewGame}>
            New Game
          </button>
        </header>
      )}

      <main className="app-main">
        {state.phase === 'setup' && <PlayerSetup onStart={actions.startGame} />}

        {state.phase === 'playing' && (
          <>
            <Scoreboard players={state.players} round={state.round} />
            <RoundInput
              players={state.players}
              roundScores={state.roundScores}
              onScoreChange={actions.setRoundScore}
              onFinishRound={actions.finishRound}
            />
          </>
        )}

        {state.phase === 'gameOver' && state.winner && (
          <>
            <Scoreboard players={state.players} round={state.round} />
            <GameOver
              winner={state.winner}
              onNewGame={actions.newGame}
              onPlayAgain={actions.playAgain}
            />
          </>
        )}
      </main>
    </div>
  );
}
