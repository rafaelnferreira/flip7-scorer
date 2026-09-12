const ROSTER_KEY = 'flip7-scorer-roster';

function normalizeName(name: string, index: number): string {
  const trimmed = name.trim();
  return trimmed || `Player ${index + 1}`;
}

export function loadRoster(): string[] {
  try {
    const raw = localStorage.getItem(ROSTER_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((entry): entry is string => typeof entry === 'string')
      .map((name, index) => normalizeName(name, index));
  } catch {
    return [];
  }
}

export function saveRoster(playerNames: string[]): string[] {
  const roster = playerNames.map((name, index) => normalizeName(name, index));
  localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
  return roster;
}
