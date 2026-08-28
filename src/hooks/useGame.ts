import { useEffect, useReducer } from 'react';
import {
  gameReducer,
  initialState,
  loadSavedState,
  saveState,
  type GameAction,
  type GameState,
} from '../gameReducer';

export function useGame() {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialState,
    (baseState): GameState => loadSavedState() ?? baseState,
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  const actions = {
    startGame: (playerNames: string[]) =>
      dispatch({ type: 'START_GAME', playerNames } satisfies GameAction),
    setRoundScore: (playerId: string, value: string) =>
      dispatch({ type: 'SET_ROUND_SCORE', playerId, value } satisfies GameAction),
    finishRound: () => dispatch({ type: 'FINISH_ROUND' } satisfies GameAction),
    newGame: () => dispatch({ type: 'NEW_GAME' } satisfies GameAction),
    playAgain: () => dispatch({ type: 'PLAY_AGAIN' } satisfies GameAction),
  };

  return { state, actions };
}
