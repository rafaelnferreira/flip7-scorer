import { describe, expect, it } from 'vitest';
import {
  getVictoryCount,
  getVictoryLeaderboard,
  incrementVictories,
  migrateNameKeyedVictories,
  parseVictories,
} from './victories';

const alice1 = { id: 'alice-1', name: 'Alice' };
const alice2 = { id: 'alice-2', name: 'Alice' };

describe('incrementVictories', () => {
  it('keeps wins separate for two players named Alice', () => {
    let victories = incrementVictories({}, [alice1]);
    victories = incrementVictories(victories, [alice1]);
    victories = incrementVictories(victories, [alice2]);

    expect(getVictoryCount(victories, alice1.id)).toBe(2);
    expect(getVictoryCount(victories, alice2.id)).toBe(1);

    const board = getVictoryLeaderboard(victories);
    expect(board).toHaveLength(2);
    expect(board.map((entry) => entry.id).sort()).toEqual(['alice-1', 'alice-2']);
  });
});

describe('parseVictories', () => {
  it('migrates a legacy name-keyed map onto the first matching roster player', () => {
    const victories = parseVictories({ Alice: 4, Bob: 1 }, [
      alice1,
      alice2,
      { id: 'bob-1', name: 'Bob' },
    ]);

    expect(getVictoryCount(victories, alice1.id)).toBe(4);
    expect(getVictoryCount(victories, alice2.id)).toBe(0);
    expect(getVictoryCount(victories, 'bob-1')).toBe(1);
  });
});

describe('migrateNameKeyedVictories', () => {
  it('does not give the same legacy Alice wins to both players', () => {
    const migrated = migrateNameKeyedVictories({ Alice: 3 }, [alice1, alice2]);
    const awarded = [alice1.id, alice2.id].filter((id) => getVictoryCount(migrated, id) > 0);
    expect(awarded).toHaveLength(1);
    expect(getVictoryCount(migrated, awarded[0])).toBe(3);
  });
});
