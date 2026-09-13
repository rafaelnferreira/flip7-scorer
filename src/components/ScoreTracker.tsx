import { useState, type FormEvent } from 'react';
import { getPlayerWinDisplay, type GameWinMap, type TrackedGame } from '../multiGameScores';
import { displayPlayerLabel, type IdentifiedPlayer } from '../player';

interface ScoreTrackerProps {
  players: IdentifiedPlayer[];
  games: TrackedGame[];
  activeGame: TrackedGame | undefined;
  wins: GameWinMap;
  onIncrement: (gameId: string, playerId: string) => void;
  onDecrement: (gameId: string, playerId: string) => void;
  onFlipGame: (direction: -1 | 1) => void;
  onAddGame: (name: string) => boolean;
}

export function ScoreTracker({
  players,
  games,
  activeGame,
  wins,
  onIncrement,
  onDecrement,
  onFlipGame,
  onAddGame,
}: ScoreTrackerProps) {
  const [adding, setAdding] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [error, setError] = useState('');

  const handleAddGame = (event: FormEvent) => {
    event.preventDefault();
    const ok = onAddGame(newGameName);
    if (!ok) {
      setError('Enter a unique game name');
      return;
    }
    setNewGameName('');
    setError('');
    setAdding(false);
  };

  if (players.length === 0) {
    return (
      <section className="tracker" aria-label="Multi-game scores">
        <p className="tracker-empty">
          Set players on the Play screen first. Their names will show up here.
        </p>
      </section>
    );
  }

  if (!activeGame) {
    return null;
  }

  const gameIndex = games.findIndex((game) => game.id === activeGame.id);

  return (
    <section className="tracker" aria-label="Multi-game scores">
      <div className="tracker-game-bar">
        <button
          type="button"
          className="btn btn-icon"
          onClick={() => onFlipGame(-1)}
          disabled={games.length < 2}
          aria-label="Previous game"
        >
          ‹
        </button>
        <div className="tracker-game-label">
          <span className="tracker-game-name">{activeGame.name}</span>
          <span className="tracker-game-meta">
            {gameIndex + 1}/{games.length}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-icon"
          onClick={() => onFlipGame(1)}
          disabled={games.length < 2}
          aria-label="Next game"
        >
          ›
        </button>
        <button
          type="button"
          className="btn btn-icon"
          onClick={() => {
            setAdding((open) => !open);
            setError('');
          }}
          aria-label="Add game"
          aria-expanded={adding}
        >
          +
        </button>
      </div>

      {adding && (
        <form className="tracker-add-game" onSubmit={handleAddGame}>
          <input
            type="text"
            value={newGameName}
            onChange={(event) => setNewGameName(event.target.value)}
            placeholder="Magic the Gathering"
            aria-label="New game name"
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-compact">
            Add
          </button>
          {error && <p className="tracker-error">{error}</p>}
        </form>
      )}

      <ul className="tracker-list">
        {players.map((player) => {
          const display = getPlayerWinDisplay(activeGame, wins, player.id);
          const label = displayPlayerLabel(player, players);
          return (
            <li key={player.id} className="tracker-row">
              <div className="tracker-player">
                <span className="tracker-player-name">{label}</span>
                {display.showBadges && (
                  <span className="tracker-badges">
                    <span className="victory-badge" title="Total wins">
                      {display.totalWins}W
                    </span>
                    <span
                      className="victory-badge victory-badge--game"
                      title={`${activeGame.name} wins`}
                    >
                      {display.gameWins}G
                    </span>
                  </span>
                )}
              </div>
              <div className="tracker-controls">
                <button
                  type="button"
                  className="btn btn-step"
                  onClick={() => onDecrement(activeGame.id, player.id)}
                  disabled={display.gameWins <= 0}
                  aria-label={`Decrease ${label} wins for ${activeGame.name}`}
                >
                  −
                </button>
                <span className="tracker-count" aria-label={`${label} wins for ${activeGame.name}`}>
                  {display.gameWins}
                </span>
                <button
                  type="button"
                  className="btn btn-step"
                  onClick={() => onIncrement(activeGame.id, player.id)}
                  aria-label={`Increase ${label} wins for ${activeGame.name}`}
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
