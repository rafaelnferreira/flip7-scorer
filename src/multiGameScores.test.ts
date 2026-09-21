import { describe, expect, it } from 'vitest';
import {
  DEFAULT_GAME_ID,
  DEFAULT_GAME_NAME,
  adjustWin,
  defaultMultiGameState,
  getGameWins,
  getPlayerWinDisplay,
  isFlip7Game,
  migrateWinsToPlayerIds,
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

describe('player identity in multi-game scores', () => {
  it('tracks two Alices as separate win counters', () => {
    let state = defaultMultiGameState;
    state = adjustWin(state, DEFAULT_GAME_ID, 'alice-1', 2);
    state = adjustWin(state, DEFAULT_GAME_ID, 'alice-2', 1);

    expect(getGameWins(state.wins, DEFAULT_GAME_ID, 'alice-1')).toBe(2);
    expect(getGameWins(state.wins, DEFAULT_GAME_ID, 'alice-2')).toBe(1);
  });

  it('migrates a legacy name key onto only the first matching player', () => {
    const legacy: GameWinMap = { [DEFAULT_GAME_ID]: { Alice: 5 } };
    const migrated = migrateWinsToPlayerIds(legacy, [
      { id: 'alice-1', name: 'Alice' },
      { id: 'alice-2', name: 'Alice' },
    ]);

    expect(getGameWins(migrated, DEFAULT_GAME_ID, 'alice-1')).toBe(5);
    expect(getGameWins(migrated, DEFAULT_GAME_ID, 'alice-2')).toBe(0);
  });
});
