import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [riotId, setRiotId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (riotId.includes('#')) {
      navigate(`/profile/${encodeURIComponent(riotId)}`);
    } else {
      alert("Please include the tagline (e.g. Player#NA1)");
    }
  };

  return (
    <div className="glass-panel" style={{ textAlign: 'center', marginTop: '10vh' }}>
      <h1 style={{ color: 'var(--val-red)', fontSize: '4rem', marginBottom: '1rem' }}>Valorant Hub</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.2rem' }}>
        The ultimate standalone hub for your Agent strategies and personal statistics.
      </p>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Enter Riot ID (e.g. TenZ#NA1)" 
          value={riotId}
          onChange={(e) => setRiotId(e.target.value)}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            width: '400px',
            outline: 'none'
          }}
        />
        <button type="submit" className="btn">Search Player</button>
      </form>

      <div className="grid grid-cols-3" style={{ marginTop: '5rem', textAlign: 'left' }}>
        <div className="glass-panel">
          <h3>Agent Wiki</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Explore every agent's lore, abilities, and official video showcases.</p>
        </div>
        <div className="glass-panel">
          <h3>Interactive Maps</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Plan your lineups and strategies with high-res minimaps.</p>
        </div>
        <div className="glass-panel">
          <h3>Live Leaderboard</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>See the top 500 Radiant players dominating the AP Server right now.</p>
        </div>
      </div>
    </div>
  );
}
