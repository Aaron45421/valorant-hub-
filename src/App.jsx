import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AgentWiki from './pages/AgentWiki';
import MapTool from './pages/MapTool';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import MatchAnalyzer from './pages/MatchAnalyzer';

function App() {
  const [apiKey, setApiKey] = useState('RGAPI-4b76de8e-462a-41a5-9fa1-5d50135208d3');

  useEffect(() => {
    const savedKey = localStorage.getItem('riotApiKey');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      // Save the default key to local storage so the services pick it up immediately
      localStorage.setItem('riotApiKey', 'RGAPI-4b76de8e-462a-41a5-9fa1-5d50135208d3');
    }
  }, []);

  const handleSaveKey = (e) => {
    setApiKey(e.target.value);
    localStorage.setItem('riotApiKey', e.target.value);
  };

  return (
    <>
      <div style={{ background: 'var(--val-red)', padding: '0.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <label style={{ fontWeight: 'bold', marginRight: '1rem' }}>Riot API Key (Expires every 24h):</label>
        <input 
          type="text" 
          value={apiKey} 
          onChange={handleSaveKey} 
          placeholder="RGAPI-..." 
          style={{ padding: '0.25rem 0.5rem', width: '300px', borderRadius: '4px', border: 'none', color: 'black' }}
        />
      </div>
      <nav>
        <Link to="/">Valorant Hub</Link>
        <Link to="/agents">Agent Wiki</Link>
        <Link to="/maps">Map Strategy</Link>
        <Link to="/leaderboard">AP Leaderboard</Link>
      </nav>
      
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agents" element={<AgentWiki />} />
          <Route path="/maps" element={<MapTool />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile/:riotId" element={<Profile />} />
          <Route path="/match/:matchId" element={<MatchAnalyzer />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
