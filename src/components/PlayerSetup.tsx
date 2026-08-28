import { useEffect, useState } from 'react';
import { MAX_PLAYERS, MIN_PLAYERS } from '../gameReducer';
import { VictoryLeaderboard } from './VictoryLeaderboard';

interface PlayerSetupProps {
  onStart: (playerNames: string[]) => void;
  leaderboard: Array<{ name: string; wins: number }>;
  getWins: (name: string) => number;
}

export function PlayerSetup({ onStart, leaderboard, getWins }: PlayerSetupProps) {
  const [playerCount, setPlayerCount] = useState(MIN_PLAYERS);
  const [names, setNames] = useState<string[]>(
    Array.from({ length: MIN_PLAYERS }, (_, index) => `Player ${index + 1}`),
  );

  useEffect(() => {
    setNames((current) => {
      if (playerCount === current.length) {
        return current;
      }
      if (playerCount > current.length) {
        return [
          ...current,
          ...Array.from(
            { length: playerCount - current.length },
            (_, index) => `Player ${current.length + index + 1}`,
          ),
        ];
      }
      return current.slice(0, playerCount);
    });
  }, [playerCount]);

  const handleCountChange = (value: string) => {
    const parsed = Number.parseInt(value.replace(/\D/g, ''), 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    setPlayerCount(Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, parsed)));
  };

  const handleNameChange = (index: number, value: string) => {
    setNames((current) => current.map((name, i) => (i === index ? value : name)));
  };

  return (
    <section className="card setup-card">
      <h1>Flip7 Scorer</h1>
      <p className="subtitle">Track scores until someone reaches 200 points.</p>

      <VictoryLeaderboard entries={leaderboard} />

      <label className="field">
        <span>Number of players</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={playerCount}
          onChange={(event) => handleCountChange(event.target.value)}
          aria-label="Number of players"
        />
      </label>

      <div className="player-names">
        {names.map((name, index) => {
          const wins = getWins(name);
          return (
            <label key={index} className="field">
              <span>
                Player {index + 1}
                {wins > 0 && <span className="victory-badge">{wins}W</span>}
              </span>
              <input
                type="text"
                value={name}
                onChange={(event) => handleNameChange(index, event.target.value)}
                placeholder={`Player ${index + 1}`}
                aria-label={`Player ${index + 1} name`}
              />
            </label>
          );
        })}
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => onStart(names)}
        disabled={playerCount < MIN_PLAYERS}
      >
        Start Game
      </button>
    </section>
  );
}
