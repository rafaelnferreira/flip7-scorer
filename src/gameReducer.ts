export type GamePhase = 'setup' | 'playing' | 'gameOver';

export interface Player {
  id: string;
  name: string;
  total: number;
}

export interface Winner {
  players: Player[];
  score: number;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  round: number;
  roundScores: Record<string, string>;
  winner: Winner | null;
}

export type GameAction =
  | { type: 'START_GAME'; playerNames: string[] }
  | { type: 'SET_ROUND_SCORE'; playerId: string; value: string }
  | { type: 'FINISH_ROUND' }
  | { type: 'NEW_GAME' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'RESTORE'; state: GameState };

export const WINNING_SCORE = 200;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 10;
const STORAGE_KEY = 'flip7-scorer-state';

export const initialState: GameState = {
  phase: 'setup',
  players: [],
  round: 1,
  roundScores: {},
  winner: null,
};

function createPlayerId(index: number): string {
  return `player-${index}-${crypto.randomUUID()}`;
}

function parseScore(value: string): number {
  if (!value) {
    return 0;
  }
  return Number.parseInt(value, 10);
}

function emptyRoundScores(players: Player[]): Record<string, string> {
  return Object.fromEntries(players.map((player) => [player.id, '']));
}

function findWinner(players: Player[]): Winner | null {
  const contenders = players.filter((player) => player.total >= WINNING_SCORE);
  if (contenders.length === 0) {
    return null;
  }

  const topScore = Math.max(...contenders.map((player) => player.total));
  const winners = contenders.filter((player) => player.total === topScore);

  return { players: winners, score: topScore };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const players: Player[] = action.playerNames.map((name, index) => ({
        id: createPlayerId(index),
        name: name.trim() || `Player ${index + 1}`,
        total: 0,
      }));

      return {
        phase: 'playing',
        players,
        round: 1,
        roundScores: emptyRoundScores(players),
        winner: null,
      };
    }

    case 'SET_ROUND_SCORE': {
      const sanitized = action.value.replace(/\D/g, '');
      return {
        ...state,
        roundScores: {
          ...state.roundScores,
          [action.playerId]: sanitized,
        },
      };
    }

    case 'FINISH_ROUND': {
      const updatedPlayers = state.players.map((player) => ({
        ...player,
        total: player.total + parseScore(state.roundScores[player.id] ?? ''),
      }));

      const winner = findWinner(updatedPlayers);
      if (winner) {
        return {
          ...state,
          phase: 'gameOver',
          players: updatedPlayers,
          roundScores: emptyRoundScores(updatedPlayers),
          winner,
        };
      }

      return {
        ...state,
        players: updatedPlayers,
        round: state.round + 1,
        roundScores: emptyRoundScores(updatedPlayers),
      };
    }

    case 'NEW_GAME':
      return { ...initialState };

    case 'PLAY_AGAIN': {
      const resetPlayers = state.players.map((player) => ({
        ...player,
        total: 0,
      }));

      return {
        phase: 'playing',
        players: resetPlayers,
        round: 1,
        roundScores: emptyRoundScores(resetPlayers),
        winner: null,
      };
    }

    case 'RESTORE':
      return action.state;

    default:
      return state;
  }
}

export function loadSavedState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed.phase || !Array.isArray(parsed.players)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: GameState): void {
  if (state.phase === 'setup') {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function formatWinnerMessage(winner: Winner): string {
  const names = winner.players.map((player) => player.name);
  if (names.length === 1) {
    return `${names[0]} wins with ${winner.score} points!`;
  }
  if (names.length === 2) {
    return `${names[0]} and ${names[1]} tie with ${winner.score} points!`;
  }
  const last = names.pop();
  return `${names.join(', ')}, and ${last} tie with ${winner.score} points!`;
}
