import { describe, expect, it } from 'vitest';
import { normalizeRoster } from './roster';

describe('normalizeRoster', () => {
  it('assigns distinct ids when two stored names match', () => {
    const roster = normalizeRoster(['Alice', 'Alice']);
    expect(roster).toHaveLength(2);
    expect(roster[0].name).toBe('Alice');
    expect(roster[1].name).toBe('Alice');
    expect(roster[0].id).not.toBe(roster[1].id);
    expect(roster[0].id.length).toBeGreaterThan(0);
  });

  it('preserves existing player ids', () => {
    const roster = normalizeRoster([
      { id: 'keep-me', name: 'Alice' },
      { id: 'keep-too', name: 'Alice' },
    ]);
    expect(roster.map((player) => player.id)).toEqual(['keep-me', 'keep-too']);
  });
});
