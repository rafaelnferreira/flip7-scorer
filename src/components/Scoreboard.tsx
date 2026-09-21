import type { Player } from '../gameReducer';
import { WINNING_SCORE } from '../gameReducer';
import { displayPlayerLabel } from '../player';

interface ScoreboardProps {
  players: Player[];
  round: number;
  getWins: (playerId: string) => number;
}

export function Scoreboard({ players, round, getWins }: ScoreboardProps) {
  return (
    <section className="scoreboard" aria-label="Scoreboard">
      <div className="scoreboard-header">
        <h2>Round {round}</h2>
        <span className="goal">First to {WINNING_SCORE}</span>
      </div>

      <div className="scoreboard-grid">
        {players.map((player) => {
          const wins = getWins(player.id);
          const label = displayPlayerLabel(player, players);
          return (
            <article
              key={player.id}
              className={`score-card ${player.total >= WINNING_SCORE ? 'score-card--winning' : ''}`}
            >
              <span className="score-card__name">
                {label}
                {wins > 0 && <span className="victory-badge">{wins}W</span>}
              </span>
              <span className="score-card__total">{player.total}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
