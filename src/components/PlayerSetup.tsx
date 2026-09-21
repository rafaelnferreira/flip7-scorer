import { useEffect, useState } from 'react';
import { MAX_PLAYERS, MIN_PLAYERS } from '../gameReducer';
import { createPlayerId, type IdentifiedPlayer } from '../player';
import { VictoryLeaderboard } from './VictoryLeaderboard';

interface PlayerSetupProps {
  onStart: (players: IdentifiedPlayer[]) => void;
  leaderboard: Array<{ id: string; name: string; wins: number }>;
  getWins: (playerId: string) => number;
  initialPlayers?: IdentifiedPlayer[];
}

function defaultPlayers(count: number): IdentifiedPlayer[] {
  return Array.from({ length: count }, (_, index) => ({
    id: createPlayerId(),
    name: `Player ${index + 1}`,
  }));
}

export function PlayerSetup({
  onStart,
  leaderboard,
  getWins,
  initialPlayers = [],
}: PlayerSetupProps) {
  const seededPlayers =
    initialPlayers.length >= MIN_PLAYERS
      ? initialPlayers.slice(0, MAX_PLAYERS)
      : defaultPlayers(MIN_PLAYERS);
  const [playerCount, setPlayerCount] = useState(seededPlayers.length);
  const [players, setPlayers] = useState<IdentifiedPlayer[]>(seededPlayers);

  useEffect(() => {
    setPlayers((current) => {
      if (playerCount === current.length) {
        return current;
      }
      if (playerCount > current.length) {
        return [
          ...current,
          ...Array.from({ length: playerCount - current.length }, (_, index) => ({
            id: createPlayerId(),
            name: `Player ${current.length + index + 1}`,
          })),
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

  const handleNameChange = (playerId: string, value: string) => {
    setPlayers((current) =>
      current.map((player) => (player.id === playerId ? { ...player, name: value } : player)),
    );
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
        {players.map((player, index) => {
          const wins = getWins(player.id);
          return (
            <label key={player.id} className="field">
              <span>
                Player {index + 1}
                {wins > 0 && <span className="victory-badge">{wins}W</span>}
              </span>
              <input
                type="text"
                value={player.name}
                onChange={(event) => handleNameChange(player.id, event.target.value)}
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
        onClick={() => onStart(players)}
        disabled={playerCount < MIN_PLAYERS}
      >
        Start Game
      </button>
    </section>
  );
}
