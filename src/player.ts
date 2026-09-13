export interface IdentifiedPlayer {
  id: string;
  name: string;
}

export function createPlayerId(): string {
  return `player-${crypto.randomUUID()}`;
}

export function normalizePlayerName(name: string, index: number): string {
  const trimmed = name.trim();
  return trimmed || `Player ${index + 1}`;
}

/** Disambiguate colliding display names using 1-based seat order. */
export function displayPlayerLabel(
  player: IdentifiedPlayer,
  players: readonly IdentifiedPlayer[],
): string {
  const duplicate = players.some((other) => other.id !== player.id && other.name === player.name);
  if (!duplicate) {
    return player.name;
  }
  const seat = players.findIndex((entry) => entry.id === player.id) + 1;
  return seat > 0 ? `${player.name} (P${seat})` : player.name;
}
