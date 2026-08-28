import { useEffect, useReducer } from 'react';
import {
  gameReducer,
  initialState,
  loadSavedState,
  saveState,
  type GameAction,
  type GameState,
} from '../gameReducer';

interface UseGameOptions {
  onRecordVictories?: (playerNames: string[]) => void;
}

export function useGame({ onRecordVictories }: UseGameOptions = {}) {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialState,
    (baseState): GameState => loadSavedState() ?? baseState,
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (state.phase === 'gameOver' && state.winner && !state.victoriesRecorded) {
      onRecordVictories?.(state.winner.players.map((player) => player.name));
      dispatch({ type: 'MARK_VICTORIES_RECORDED' } satisfies GameAction);
    }
  }, [state.phase, state.winner, state.victoriesRecorded, onRecordVictories]);

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
