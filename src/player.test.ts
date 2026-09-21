import { describe, expect, it } from 'vitest';
import { displayPlayerLabel, normalizePlayerName } from './player';

describe('displayPlayerLabel', () => {
  it('returns the display name when it is unique', () => {
    const players = [
      { id: 'a', name: 'Alice' },
      { id: 'b', name: 'Bob' },
    ];
    expect(displayPlayerLabel(players[0], players)).toBe('Alice');
  });

  it('adds a seat suffix when two players share a name', () => {
    const players = [
      { id: 'a1', name: 'Alice' },
      { id: 'a2', name: 'Alice' },
    ];
    expect(displayPlayerLabel(players[0], players)).toBe('Alice (P1)');
    expect(displayPlayerLabel(players[1], players)).toBe('Alice (P2)');
  });
});

describe('normalizePlayerName', () => {
  it('falls back to a seat name when blank', () => {
    expect(normalizePlayerName('  ', 2)).toBe('Player 3');
  });
});
