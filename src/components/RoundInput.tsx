import { useRef, type KeyboardEvent } from 'react';
import type { Player } from '../gameReducer';

interface RoundInputProps {
  players: Player[];
  roundScores: Record<string, string>;
  onScoreChange: (playerId: string, value: string) => void;
  onFinishRound: () => void;
}

export function RoundInput({
  players,
  roundScores,
  onScoreChange,
  onFinishRound,
}: RoundInputProps) {
  const lastInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter' && index === players.length - 1) {
      onFinishRound();
    }
  };

  return (
    <section className="card round-input">
      <h3>Enter round scores</h3>
      <p className="hint">Type numbers only. Leave blank for 0 (bust).</p>

      <div className="round-fields">
        {players.map((player, index) => (
          <label key={player.id} className="round-field">
            <span>{player.name}</span>
            <input
              ref={index === players.length - 1 ? lastInputRef : undefined}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={roundScores[player.id] ?? ''}
              onChange={(event) => onScoreChange(player.id, event.target.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              placeholder="0"
              aria-label={`${player.name} round score`}
            />
          </label>
        ))}
      </div>

      <button type="button" className="btn btn-primary btn-large" onClick={onFinishRound}>
        Finish Round
      </button>
    </section>
  );
}
