import { useCallback, useRef, useState } from 'react';
import type { IdentifiedPlayer } from '../player';
import {
  getVictoryCount,
  getVictoryLeaderboard,
  loadVictories,
  recordVictories as persistVictories,
  type VictoryRecord,
} from '../victories';

export function useVictories(roster: IdentifiedPlayer[] = []) {
  const [victories, setVictories] = useState<VictoryRecord>(() => loadVictories(roster));
  const rosterRef = useRef(roster);
  rosterRef.current = roster;

  const recordVictories = useCallback((winners: IdentifiedPlayer[]) => {
    const updated = persistVictories(winners, rosterRef.current);
    setVictories(updated);
    return updated;
  }, []);

  const getWins = useCallback(
    (playerId: string) => getVictoryCount(victories, playerId),
    [victories],
  );

  const leaderboard = getVictoryLeaderboard(victories);

  return { victories, recordVictories, getWins, leaderboard };
}
