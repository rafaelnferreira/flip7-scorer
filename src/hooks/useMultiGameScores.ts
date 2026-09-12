import { useCallback, useEffect, useState } from 'react';
import {
  addGame,
  adjustWin,
  cycleActiveGame,
  getGameWins,
  getTotalWins,
  loadMultiGameScores,
  saveMultiGameScores,
  setActiveGame,
  type MultiGameScoresState,
} from '../multiGameScores';

export function useMultiGameScores() {
  const [state, setState] = useState<MultiGameScoresState>(loadMultiGameScores);

  useEffect(() => {
    saveMultiGameScores(state);
  }, [state]);

  const increment = useCallback((gameId: string, playerName: string) => {
    setState((current) => adjustWin(current, gameId, playerName, 1));
  }, []);

  const decrement = useCallback((gameId: string, playerName: string) => {
    setState((current) => adjustWin(current, gameId, playerName, -1));
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
    getGameWins: (playerName: string) =>
      activeGame ? getGameWins(state.wins, activeGame.id, playerName) : 0,
    getTotalWins: (playerName: string) => getTotalWins(state.wins, playerName),
  };
}
