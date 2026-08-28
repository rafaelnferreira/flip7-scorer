import { useCallback, useState } from 'react';
import {
  getVictoryCount,
  getVictoryLeaderboard,
  loadVictories,
  recordVictories as persistVictories,
  type VictoryRecord,
} from '../victories';

export function useVictories() {
  const [victories, setVictories] = useState<VictoryRecord>(loadVictories);

  const recordVictories = useCallback((playerNames: string[]) => {
    const updated = persistVictories(playerNames);
    setVictories(updated);
    return updated;
  }, []);

  const getWins = useCallback(
    (name: string) => getVictoryCount(victories, name),
    [victories],
  );

  const leaderboard = getVictoryLeaderboard(victories);

  return { victories, recordVictories, getWins, leaderboard };
}
