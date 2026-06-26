import { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/riotApi';
import { getCompetitiveTiers } from '../services/valApi';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [leaderboardData, tierData] = await Promise.all([
          getLeaderboard(),
          getCompetitiveTiers()
        ]);
        setPlayers(leaderboardData.players);
        setTiers(tierData);
      } catch (err) {
        setError('Failed to fetch leaderboard. Make sure your API key is valid and you have production/personal access if needed.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getTierIcon = (tierId) => {
    const tier = tiers.find(t => t.tier === tierId);
    return tier ? tier.smallIcon : null;
  };

  const getTierName = (tierId) => {
    const tier = tiers.find(t => t.tier === tierId);
    return tier ? tier.tierName : 'Unknown';
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Leaderboard...</div>;
  if (error) return <div style={{ color: 'var(--val-red)', textAlign: 'center', marginTop: '5rem' }}>{error}</div>;

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <h1 style={{ color: 'var(--val-red)', marginBottom: '1rem', textAlign: 'center' }}>AP Radiant Leaderboard</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Top 500 players in the Asia-Pacific Server</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--val-red)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Rank</th>
              <th style={{ padding: '1rem' }}>Player</th>
              <th style={{ padding: '1rem' }}>Rating (RR)</th>
              <th style={{ padding: '1rem' }}>Wins</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.leaderboardRank} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{player.leaderboardRank}</td>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={getTierIcon(player.competitiveTier)} alt={getTierName(player.competitiveTier)} style={{ width: '32px', height: '32px' }} title={getTierName(player.competitiveTier)} />
                  <span style={{ fontSize: '1.1rem' }}>
                    {player.gameName ? `${player.gameName}#${player.tagLine}` : 'Anonymous Player'}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--val-red)', fontWeight: 'bold' }}>{player.rankedRating}</td>
                <td style={{ padding: '1rem' }}>{player.numberOfWins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
