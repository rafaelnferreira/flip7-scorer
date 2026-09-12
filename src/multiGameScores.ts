export interface TrackedGame {
  id: string;
  name: string;
}

/** wins[gameId][playerName] = win count */
export type GameWinMap = Record<string, Record<string, number>>;

export interface MultiGameScoresState {
  games: TrackedGame[];
  activeGameId: string;
  wins: GameWinMap;
}

const STORAGE_KEY = 'flip7-scorer-multi-game';
export const DEFAULT_GAME_ID = 'flip7';
export const DEFAULT_GAME_NAME = 'Flip7';

export const defaultMultiGameState: MultiGameScoresState = {
  games: [{ id: DEFAULT_GAME_ID, name: DEFAULT_GAME_NAME }],
  activeGameId: DEFAULT_GAME_ID,
  wins: {},
};

function normalizeName(name: string): string {
  return name.trim() || 'Unknown';
}

function createGameId(): string {
  return `game-${crypto.randomUUID()}`;
}

export function loadMultiGameScores(): MultiGameScoresState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...defaultMultiGameState, games: [...defaultMultiGameState.games] };
    }
    const parsed = JSON.parse(raw) as Partial<MultiGameScoresState>;
    const games =
      Array.isArray(parsed.games) && parsed.games.length > 0
        ? parsed.games.filter(
            (game): game is TrackedGame =>
              typeof game === 'object' &&
              game !== null &&
              typeof game.id === 'string' &&
              typeof game.name === 'string',
          )
        : [...defaultMultiGameState.games];

    if (games.length === 0) {
      games.push({ id: DEFAULT_GAME_ID, name: DEFAULT_GAME_NAME });
    }

    const activeGameId =
      typeof parsed.activeGameId === 'string' && games.some((game) => game.id === parsed.activeGameId)
        ? parsed.activeGameId
        : games[0].id;

    const wins =
      typeof parsed.wins === 'object' && parsed.wins !== null && !Array.isArray(parsed.wins)
        ? (parsed.wins as GameWinMap)
        : {};

    return { games, activeGameId, wins };
  } catch {
    return { ...defaultMultiGameState, games: [...defaultMultiGameState.games] };
  }
}

export function saveMultiGameScores(state: MultiGameScoresState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getGameWins(
  wins: GameWinMap,
  gameId: string,
  playerName: string,
): number {
  return wins[gameId]?.[normalizeName(playerName)] ?? 0;
}

export function getTotalWins(wins: GameWinMap, playerName: string): number {
  const key = normalizeName(playerName);
  return Object.values(wins).reduce((sum, byPlayer) => sum + (byPlayer[key] ?? 0), 0);
}

/** Flip7 is the only game with a full play/completion flow; others are win counters only. */
export function isFlip7Game(game: Pick<TrackedGame, 'id'>): boolean {
  return game.id === DEFAULT_GAME_ID;
}

export type PlayerWinDisplay =
  | { gameWins: number; showBadges: true; totalWins: number }
  | { gameWins: number; showBadges: false; totalWins: null };

/**
 * For Flip7, show total + per-game badges (completed Flip7 games matter).
 * For other games, only expose the win count — nothing has been "completed" there.
 */
export function getPlayerWinDisplay(
  activeGame: TrackedGame,
  wins: GameWinMap,
  playerName: string,
): PlayerWinDisplay {
  const gameWins = getGameWins(wins, activeGame.id, playerName);
  if (isFlip7Game(activeGame)) {
    return {
      gameWins,
      showBadges: true,
      totalWins: getTotalWins(wins, playerName),
    };
  }
  return { gameWins, showBadges: false, totalWins: null };
}

export function adjustWin(
  state: MultiGameScoresState,
  gameId: string,
  playerName: string,
  delta: number,
): MultiGameScoresState {
  const key = normalizeName(playerName);
  const current = state.wins[gameId]?.[key] ?? 0;
  const next = Math.max(0, current + delta);

  return {
    ...state,
    wins: {
      ...state.wins,
      [gameId]: {
        ...state.wins[gameId],
        [key]: next,
      },
    },
  };
}

export function addGame(
  state: MultiGameScoresState,
  name: string,
): MultiGameScoresState | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return null;
  }

  const duplicate = state.games.some(
    (game) => game.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (duplicate) {
    return null;
  }

  const game: TrackedGame = { id: createGameId(), name: trimmed };
  return {
    ...state,
    games: [...state.games, game],
    activeGameId: game.id,
  };
}

export function setActiveGame(
  state: MultiGameScoresState,
  gameId: string,
): MultiGameScoresState {
  if (!state.games.some((game) => game.id === gameId)) {
    return state;
  }
  return { ...state, activeGameId: gameId };
}

export function cycleActiveGame(
  state: MultiGameScoresState,
  direction: -1 | 1,
): MultiGameScoresState {
  const index = state.games.findIndex((game) => game.id === state.activeGameId);
  if (index < 0 || state.games.length === 0) {
    return state;
  }
  const nextIndex = (index + direction + state.games.length) % state.games.length;
  return { ...state, activeGameId: state.games[nextIndex].id };
}
