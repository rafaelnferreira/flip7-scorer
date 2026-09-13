import type { IdentifiedPlayer } from './player';

export interface VictoryEntry {
  name: string;
  wins: number;
}

/** Wins keyed by stable player id. */
export type VictoryRecord = Record<string, VictoryEntry>;

const VICTORIES_KEY = 'flip7-scorer-victories';

function isVictoryEntry(value: unknown): value is VictoryEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as VictoryEntry).name === 'string' &&
    typeof (value as VictoryEntry).wins === 'number'
  );
}

function isIdKeyedRecord(parsed: unknown): parsed is VictoryRecord {
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return false;
  }
  const values = Object.values(parsed);
  return values.length === 0 || values.every(isVictoryEntry);
}

/** Convert legacy `{ [name]: wins }` maps onto the first roster player with that name. */
export function migrateNameKeyedVictories(
  legacy: Record<string, number>,
  roster: IdentifiedPlayer[],
): VictoryRecord {
  const migrated: VictoryRecord = {};
  const claimed = new Set<string>();

  for (const [name, wins] of Object.entries(legacy)) {
    if (typeof wins !== 'number' || wins <= 0) {
      continue;
    }
    const match = roster.find((player) => player.name === name && !claimed.has(player.id));
    if (match) {
      claimed.add(match.id);
      migrated[match.id] = { name: match.name, wins };
    } else {
      migrated[`legacy-${name}`] = { name, wins };
    }
  }

  return migrated;
}

export function parseVictories(raw: unknown, roster: IdentifiedPlayer[] = []): VictoryRecord {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return {};
  }

  if (isIdKeyedRecord(raw)) {
    return raw;
  }

  const legacy: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'number') {
      legacy[key] = value;
    }
  }
  return migrateNameKeyedVictories(legacy, roster);
}

export function loadVictories(roster: IdentifiedPlayer[] = []): VictoryRecord {
  try {
    const raw = localStorage.getItem(VICTORIES_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as unknown;
    const victories = parseVictories(parsed, roster);
    if (!isIdKeyedRecord(parsed)) {
      saveVictories(victories);
    }
    return victories;
  } catch {
    return {};
  }
}

export function saveVictories(victories: VictoryRecord): void {
  localStorage.setItem(VICTORIES_KEY, JSON.stringify(victories));
}

export function getVictoryCount(victories: VictoryRecord, playerId: string): number {
  return victories[playerId]?.wins ?? 0;
}

export function incrementVictories(
  victories: VictoryRecord,
  winners: IdentifiedPlayer[],
): VictoryRecord {
  const updated = { ...victories };

  for (const winner of winners) {
    const current = updated[winner.id];
    updated[winner.id] = {
      name: winner.name,
      wins: (current?.wins ?? 0) + 1,
    };
  }

  return updated;
}

export function recordVictories(
  winners: IdentifiedPlayer[],
  roster: IdentifiedPlayer[] = [],
): VictoryRecord {
  const updated = incrementVictories(loadVictories(roster), winners);
  saveVictories(updated);
  return updated;
}

export function getVictoryLeaderboard(
  victories: VictoryRecord,
): Array<{ id: string; name: string; wins: number }> {
  return Object.entries(victories)
    .map(([id, entry]) => ({ id, name: entry.name, wins: entry.wins }))
    .filter((entry) => entry.wins > 0)
    .sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}
