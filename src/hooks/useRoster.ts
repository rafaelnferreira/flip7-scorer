import { useCallback, useState } from 'react';
import { loadRoster, saveRoster } from '../roster';

export function useRoster() {
  const [roster, setRoster] = useState<string[]>(loadRoster);

  const updateRoster = useCallback((playerNames: string[]) => {
    const saved = saveRoster(playerNames);
    setRoster(saved);
    return saved;
  }, []);

  return { roster, updateRoster };
}
