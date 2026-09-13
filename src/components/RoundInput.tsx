import { useState, useRef, type KeyboardEvent } from 'react';
import { sanitizeRoundScore, type Player } from '../gameReducer';
import { displayPlayerLabel } from '../player';

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
  const [error, setError] = useState('');

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter' && index === players.length - 1) {
      onFinishRound();
    }
  };

  const handleScoreChange = (playerId: string, raw: string) => {
    const sanitized = sanitizeRoundScore(raw);
    if (sanitized.rejectedNegative) {
      setError('Scores cannot be negative.');
      return;
    }
    setError('');
    onScoreChange(playerId, sanitized.value);
  };

  return (
    <section className="card round-input">
      <h3>Enter round scores</h3>
      <p className="hint">Type non-negative numbers only. Leave blank for 0 (bust).</p>

      <div className="round-fields">
        {players.map((player, index) => {
          const label = displayPlayerLabel(player, players);
          return (
            <label key={player.id} className="round-field">
              <span>{label}</span>
              <input
                ref={index === players.length - 1 ? lastInputRef : undefined}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={roundScores[player.id] ?? ''}
                onChange={(event) => handleScoreChange(player.id, event.target.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                placeholder="0"
                aria-label={`${label} round score`}
                aria-invalid={Boolean(error)}
              />
            </label>
          );
        })}
      </div>

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}

      <button type="button" className="btn btn-primary btn-large" onClick={onFinishRound}>
        Finish Round
      </button>
    </section>
  );
}
