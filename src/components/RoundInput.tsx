import { useState, useRef, type KeyboardEvent } from 'react';
import { applyRoundScoreInput, type Player } from '../gameReducer';
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
  const [displayed, setDisplayed] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [invalidId, setInvalidId] = useState<string | null>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter' && index === players.length - 1) {
      handleFinish();
    }
  };

  const handleScoreChange = (playerId: string, raw: string) => {
    const result = applyRoundScoreInput(raw);
    setDisplayed((current) => ({ ...current, [playerId]: result.displayed }));
    if (result.rejectedNegative) {
      setError('Scores cannot be negative.');
      setInvalidId(playerId);
      onScoreChange(playerId, '');
      return;
    }
    setError('');
    setInvalidId(null);
    onScoreChange(playerId, result.stored);
  };

  const handleFinish = () => {
    setDisplayed({});
    setError('');
    setInvalidId(null);
    onFinishRound();
  };

  return (
    <section className="card round-input">
      <h3>Enter round scores</h3>
      <p className="hint">Type non-negative numbers only. Leave blank for 0 (bust).</p>

      <div className="round-fields">
        {players.map((player, index) => {
          const label = displayPlayerLabel(player, players);
          const invalid = invalidId === player.id;
          return (
            <label key={player.id} className="round-field">
              <span>{label}</span>
              <input
                ref={index === players.length - 1 ? lastInputRef : undefined}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={displayed[player.id] ?? roundScores[player.id] ?? ''}
                onChange={(event) => handleScoreChange(player.id, event.target.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                placeholder="0"
                aria-label={`${label} round score`}
                aria-invalid={invalid || undefined}
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

      <button type="button" className="btn btn-primary btn-large" onClick={handleFinish}>
        Finish Round
      </button>
    </section>
  );
}
