import { GameOver } from './components/GameOver';
import { PlayerSetup } from './components/PlayerSetup';
import { RoundInput } from './components/RoundInput';
import { Scoreboard } from './components/Scoreboard';
import { useGame } from './hooks/useGame';
import { useVictories } from './hooks/useVictories';

export default function App() {
  const { recordVictories, getWins, leaderboard } = useVictories();
  const { state, actions } = useGame({ onRecordVictories: recordVictories });

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
        {state.phase === 'setup' && (
          <PlayerSetup onStart={actions.startGame} leaderboard={leaderboard} getWins={getWins} />
        )}

        {state.phase === 'playing' && (
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

        {state.phase === 'gameOver' && state.winner && (
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
