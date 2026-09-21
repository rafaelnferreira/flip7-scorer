import { formatWinnerMessage, type Winner } from '../gameReducer';
import { displayPlayerLabel } from '../player';

interface GameOverProps {
  winner: Winner;
  players: Array<{ id: string; name: string }>;
  getWins: (playerId: string) => number;
  onNewGame: () => void;
  onPlayAgain: () => void;
}

export function GameOver({ winner, players, getWins, onNewGame, onPlayAgain }: GameOverProps) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <section className="card game-over-card">
        <h2 id="game-over-title">Game Over!</h2>
        <p className="winner-message">{formatWinnerMessage(winner, players)}</p>

        <ul className="victory-summary">
          {winner.players.map((player) => {
            const wins = getWins(player.id);
            const label = displayPlayerLabel(player, players);
            return (
              <li key={player.id}>
                {label}: {wins} total {wins === 1 ? 'win' : 'wins'}
              </li>
            );
          })}
        </ul>

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
