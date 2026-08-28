export type VictoryRecord = Record<string, number>;

const VICTORIES_KEY = 'flip7-scorer-victories';

function normalizeName(name: string): string {
  return name.trim() || 'Unknown';
}

export function loadVictories(): VictoryRecord {
  try {
    const raw = localStorage.getItem(VICTORIES_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as VictoryRecord;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

export function saveVictories(victories: VictoryRecord): void {
  localStorage.setItem(VICTORIES_KEY, JSON.stringify(victories));
}

export function getVictoryCount(victories: VictoryRecord, name: string): number {
  return victories[normalizeName(name)] ?? 0;
}

export function recordVictories(playerNames: string[]): VictoryRecord {
  const victories = loadVictories();
  const updated = { ...victories };

  for (const name of playerNames) {
    const key = normalizeName(name);
    updated[key] = (updated[key] ?? 0) + 1;
  }

  saveVictories(updated);
  return updated;
}

export function getVictoryLeaderboard(victories: VictoryRecord): Array<{ name: string; wins: number }> {
  return Object.entries(victories)
    .map(([name, wins]) => ({ name, wins }))
    .filter((entry) => entry.wins > 0)
    .sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name));
}
