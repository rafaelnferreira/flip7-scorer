import { useCallback, useState } from 'react';
import { loadRoster, saveRoster, type RosterPlayer } from '../roster';

export function useRoster() {
  const [roster, setRoster] = useState<RosterPlayer[]>(loadRoster);

  const updateRoster = useCallback((players: Array<{ id?: string; name: string }>) => {
    const saved = saveRoster(players);
    setRoster(saved);
    return saved;
  }, []);

  return { roster, updateRoster };
}
