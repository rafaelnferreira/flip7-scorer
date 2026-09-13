import { describe, expect, it } from 'vitest';
import {
  formatWinnerMessage,
  gameReducer,
  initialState,
  sanitizeRoundScore,
  type GameState,
  type Player,
} from './gameReducer';

function playingState(players: Player[]): GameState {
  return {
    phase: 'playing',
    players,
    round: 1,
    roundScores: Object.fromEntries(players.map((player) => [player.id, ''])),
    winner: null,
    victoriesRecorded: false,
  };
}

describe('sanitizeRoundScore', () => {
  it('keeps non-negative digits', () => {
    expect(sanitizeRoundScore('12')).toEqual({ value: '12', rejectedNegative: false });
    expect(sanitizeRoundScore('')).toEqual({ value: '', rejectedNegative: false });
  });

  it('rejects negatives instead of stripping the minus into a positive', () => {
    expect(sanitizeRoundScore('-5')).toEqual({ value: '', rejectedNegative: true });
    expect(sanitizeRoundScore(' -5')).toEqual({ value: '', rejectedNegative: true });
    expect(sanitizeRoundScore('5-')).toEqual({ value: '', rejectedNegative: true });
  });
});

describe('gameReducer scoring', () => {
  const players: Player[] = [
    { id: 'p1', name: 'Alice', total: 10 },
    { id: 'p2', name: 'Alice', total: 8 },
  ];

  it('does not store a silently-absed negative score', () => {
    const started = playingState(players);
    const afterNegative = gameReducer(started, {
      type: 'SET_ROUND_SCORE',
      playerId: 'p1',
      value: '-5',
    });
    expect(afterNegative.roundScores.p1).toBe('');

    const finished = gameReducer(afterNegative, { type: 'FINISH_ROUND' });
    expect(finished.players[0].total).toBe(10);
  });

  it('adds a typed positive score', () => {
    const started = playingState(players);
    const withScore = gameReducer(started, {
      type: 'SET_ROUND_SCORE',
      playerId: 'p1',
      value: '5',
    });
    const finished = gameReducer(withScore, { type: 'FINISH_ROUND' });
    expect(finished.players[0].total).toBe(15);
    expect(finished.players[1].total).toBe(8);
  });

  it('reuses provided player ids so two Alices stay distinct', () => {
    const next = gameReducer(initialState, {
      type: 'START_GAME',
      players: [
        { id: 'alice-1', name: 'Alice' },
        { id: 'alice-2', name: 'Alice' },
      ],
    });
    expect(next.players.map((player) => player.id)).toEqual(['alice-1', 'alice-2']);
    expect(next.players.map((player) => player.name)).toEqual(['Alice', 'Alice']);
  });
});

describe('formatWinnerMessage', () => {
  it('disambiguates tied winners who share a name', () => {
    const players = [
      { id: 'a1', name: 'Alice', total: 200 },
      { id: 'a2', name: 'Alice', total: 200 },
    ];
    const message = formatWinnerMessage(
      { players, score: 200 },
      players,
    );
    expect(message).toBe('Alice (P1) and Alice (P2) tie with 200 points!');
  });
});
