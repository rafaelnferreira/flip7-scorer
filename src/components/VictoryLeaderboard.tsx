interface VictoryLeaderboardProps {
  entries: Array<{ name: string; wins: number }>;
}

export function VictoryLeaderboard({ entries }: VictoryLeaderboardProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="victory-leaderboard" aria-label="Victory leaderboard">
      <h2>All-time wins</h2>
      <ul className="victory-list">
        {entries.map((entry) => (
          <li key={entry.name} className="victory-item">
            <span className="victory-item__name">{entry.name}</span>
            <span className="victory-item__wins">
              {entry.wins} {entry.wins === 1 ? 'win' : 'wins'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
