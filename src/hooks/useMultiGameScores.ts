import { useCallback, useEffect, useState } from 'react';
import type { IdentifiedPlayer } from '../player';
import {
  addGame,
  adjustWin,
  cycleActiveGame,
  getGameWins,
  getTotalWins,
  loadMultiGameScores,
  migrateWinsToPlayerIds,
  saveMultiGameScores,
  setActiveGame,
  type MultiGameScoresState,
} from '../multiGameScores';

export function useMultiGameScores(roster: IdentifiedPlayer[] = []) {
  const [state, setState] = useState<MultiGameScoresState>(loadMultiGameScores);

  useEffect(() => {
    saveMultiGameScores(state);
  }, [state]);

  useEffect(() => {
    if (roster.length === 0) {
      return;
    }
    setState((current) => {
      const wins = migrateWinsToPlayerIds(current.wins, roster);
      if (JSON.stringify(wins) === JSON.stringify(current.wins)) {
        return current;
      }
      return { ...current, wins };
    });
  }, [roster]);

  const increment = useCallback((gameId: string, playerId: string) => {
    setState((current) => adjustWin(current, gameId, playerId, 1));
  }, []);

  const decrement = useCallback((gameId: string, playerId: string) => {
    setState((current) => adjustWin(current, gameId, playerId, -1));
  }, []);

  const createGame = useCallback((name: string) => {
    let created = false;
    setState((current) => {
      const next = addGame(current, name);
      if (!next) {
        return current;
      }
      created = true;
      return next;
    });
    return created;
  }, []);

  const selectGame = useCallback((gameId: string) => {
    setState((current) => setActiveGame(current, gameId));
  }, []);

  const flipGame = useCallback((direction: -1 | 1) => {
    setState((current) => cycleActiveGame(current, direction));
  }, []);

  const activeGame =
    state.games.find((game) => game.id === state.activeGameId) ?? state.games[0];

  return {
    games: state.games,
    activeGame,
    wins: state.wins,
    increment,
    decrement,
    createGame,
    selectGame,
    flipGame,
    getGameWins: (playerId: string) =>
      activeGame ? getGameWins(state.wins, activeGame.id, playerId) : 0,
    getTotalWins: (playerId: string) => getTotalWins(state.wins, playerId),
  };
}
