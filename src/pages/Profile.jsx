import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAccountByRiotId, getMatchlist, getMatchDetails } from '../services/riotApi';
import { getAgentMap, getMapsMap } from '../services/valApi';

export default function Profile() {
  const { riotId } = useParams();
  const [account, setAccount] = useState(null);
  const [matches, setMatches] = useState([]);
  const [agentMap, setAgentMap] = useState({});
  const [mapsMap, setMapsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError('');
        
        // 1. Get Val API mappings
        const [aMap, mMap] = await Promise.all([getAgentMap(), getMapsMap()]);
        setAgentMap(aMap);
        setMapsMap(mMap);

        // 2. Parse Riot ID
        const [gameName, tagLine] = decodeURIComponent(riotId).split('#');
        if (!gameName || !tagLine) {
          throw new Error("Invalid Riot ID format. Use Name#Tag");
        }

        // 3. Fetch Account PUUID
        const acc = await getAccountByRiotId(gameName, tagLine);
        setAccount(acc);

        // 4. Fetch Matchlist (last 5 for quickness, API returns array of matchIds)
        const matchlist = await getMatchlist(acc.puuid);
        const matchIds = matchlist.slice(0, 5); // Limit to 5 for performance
        
        // 5. Fetch Match Details
        const matchDetailsPromises = matchIds.map(id => getMatchDetails(id));
        const detailedMatches = await Promise.all(matchDetailsPromises);
        setMatches(detailedMatches);
        
      } catch (err) {
        setError(err.response?.status === 403 
          ? "API Key is invalid or expired. Please update it in the code."
          : err.message || "Failed to fetch profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [riotId]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Profile for {decodeURIComponent(riotId)}...</div>;
  if (error) return <div style={{ color: 'var(--val-red)', textAlign: 'center', marginTop: '5rem' }}>{error}</div>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-darker)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'var(--val-red)' }}>
          {account.gameName.charAt(0)}
        </div>
        <div>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>{account.gameName} <span style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}>#{account.tagLine}</span></h1>
          <p style={{ color: 'var(--val-red)', fontWeight: 'bold' }}>Level {account.accountLevel || '???'}</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Recent Matches</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {matches.map(match => {
          // Find player in match
          const playerStats = match.players.find(p => p.puuid === account.puuid);
          if (!playerStats) return null;

          const agent = agentMap[playerStats.characterId];
          const mapInfo = mapsMap[match.matchInfo.mapId];
          const won = playerStats.teamId === match.teams.find(t => t.won)?.teamId;

          return (
            <Link to={`/match/${match.matchInfo.matchId}`} key={match.matchInfo.matchId}>
              <div className="glass-panel" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2rem', 
                borderLeft: `5px solid ${won ? '#00ff00' : 'var(--val-red)'}`,
                cursor: 'pointer'
              }}>
                {agent && (
                  <img src={agent.displayIconSmall} alt={agent.displayName} style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
                )}
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: won ? '#00ff00' : 'var(--val-red)' }}>{won ? 'VICTORY' : 'DEFEAT'}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{mapInfo?.displayName || match.matchInfo.mapId}</p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: 0 }}>{playerStats.stats.kills} / {playerStats.stats.deaths} / {playerStats.stats.assists}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>KDA</p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: 0 }}>{playerStats.stats.score}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Combat Score</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
