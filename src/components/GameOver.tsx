import { formatWinnerMessage, type Winner } from '../gameReducer';

interface GameOverProps {
  winner: Winner;
  onNewGame: () => void;
  onPlayAgain: () => void;
}

export function GameOver({ winner, onNewGame, onPlayAgain }: GameOverProps) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <section className="card game-over-card">
        <h2 id="game-over-title">Game Over!</h2>
        <p className="winner-message">{formatWinnerMessage(winner)}</p>

        <div className="game-over-actions">
          <button type="button" className="btn btn-primary" onClick={onPlayAgain}>
            Play Again
          </button>
          <button type="button" className="btn btn-secondary" onClick={onNewGame}>
            New Game
          </button>
        </div>
      </section>
    </div>
  );
}
