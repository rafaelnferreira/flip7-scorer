import { createPlayerId, normalizePlayerName, type IdentifiedPlayer } from './player';

export type RosterPlayer = IdentifiedPlayer;

const ROSTER_KEY = 'flip7-scorer-roster';

function isRosterPlayer(entry: unknown): entry is RosterPlayer {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    typeof (entry as RosterPlayer).id === 'string' &&
    (entry as RosterPlayer).id.length > 0 &&
    typeof (entry as RosterPlayer).name === 'string'
  );
}

export function normalizeRoster(entries: unknown[]): RosterPlayer[] {
  return entries.map((entry, index) => {
    if (isRosterPlayer(entry)) {
      return {
        id: entry.id,
        name: normalizePlayerName(entry.name, index),
      };
    }
    const name = typeof entry === 'string' ? entry : '';
    return {
      id: createPlayerId(),
      name: normalizePlayerName(name, index),
    };
  });
}

export function loadRoster(): RosterPlayer[] {
  try {
    const raw = localStorage.getItem(ROSTER_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    const roster = normalizeRoster(parsed);
    const needsPersist = parsed.some((entry) => !isRosterPlayer(entry));
    if (needsPersist) {
      localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
    }
    return roster;
  } catch {
    return [];
  }
}

export function saveRoster(players: Array<{ id?: string; name: string }>): RosterPlayer[] {
  const roster = players.map((player, index) => ({
    id: player.id?.trim() || createPlayerId(),
    name: normalizePlayerName(player.name, index),
  }));
  localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
  return roster;
}
