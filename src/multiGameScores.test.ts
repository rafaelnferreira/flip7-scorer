import { describe, expect, it } from 'vitest';
import {
  DEFAULT_GAME_ID,
  DEFAULT_GAME_NAME,
  getPlayerWinDisplay,
  isFlip7Game,
  type GameWinMap,
  type TrackedGame,
} from './multiGameScores';

const flip7: TrackedGame = { id: DEFAULT_GAME_ID, name: DEFAULT_GAME_NAME };
const magic: TrackedGame = { id: 'game-magic', name: 'Magic the Gathering' };

const wins: GameWinMap = {
  [DEFAULT_GAME_ID]: { Alex: 2, Sam: 1 },
  'game-magic': { Alex: 1, Jordan: 1 },
};

describe('isFlip7Game', () => {
  it('recognizes the default Flip7 game', () => {
    expect(isFlip7Game(flip7)).toBe(true);
  });

  it('treats other games as non-Flip7', () => {
    expect(isFlip7Game(magic)).toBe(false);
  });
});

describe('getPlayerWinDisplay', () => {
  it('shows total and per-game badges for Flip7', () => {
    expect(getPlayerWinDisplay(flip7, wins, 'Alex')).toEqual({
      gameWins: 2,
      showBadges: true,
      totalWins: 3,
    });
  });

  it('shows only the win count for non-Flip7 games (no completion badges)', () => {
    expect(getPlayerWinDisplay(magic, wins, 'Alex')).toEqual({
      gameWins: 1,
      showBadges: false,
      totalWins: null,
    });
  });

  it('returns zero wins without badges for a player with no wins in a non-Flip7 game', () => {
    expect(getPlayerWinDisplay(magic, wins, 'Sam')).toEqual({
      gameWins: 0,
      showBadges: false,
      totalWins: null,
    });
  });
});
