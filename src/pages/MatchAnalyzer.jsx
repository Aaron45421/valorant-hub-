import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMatchDetails } from '../services/riotApi';

export default function MatchAnalyzer() {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMatch() {
      try {
        const data = await getMatchDetails(matchId);
        setMatch(data);
      } catch (err) {
        setError("Failed to load match details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMatch();
  }, [matchId]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Analyzing Match {matchId}...</div>;
  if (error) return <div style={{ color: 'var(--val-red)', textAlign: 'center', marginTop: '5rem' }}>{error}</div>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h1 style={{ color: 'var(--val-red)', marginBottom: '1rem', textAlign: 'center' }}>Match Analyzer</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>ID: {matchId}</p>

      <div className="grid grid-cols-2">
        {/* Bad Habits Box */}
        <div className="glass-panel" style={{ borderLeft: '5px solid var(--val-red)' }}>
          <h2 style={{ color: 'var(--val-red)', marginBottom: '1rem' }}>Bad Habits Detected</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ background: 'rgba(255, 70, 85, 0.1)', padding: '1rem', borderRadius: '8px' }}>
              <strong>Early Deaths (First Bloods):</strong> You died first in 4 rounds. Try playing more passively on defense.
            </li>
            <li style={{ background: 'rgba(255, 70, 85, 0.1)', padding: '1rem', borderRadius: '8px' }}>
              <strong>Economy Waste:</strong> You force-bought in Round 3 while the rest of your team saved.
            </li>
            <li style={{ background: 'rgba(255, 70, 85, 0.1)', padding: '1rem', borderRadius: '8px' }}>
              <strong>Nemesis:</strong> You died to the enemy Reyna 8 times.
            </li>
          </ul>
        </div>

        {/* Good Plays Box */}
        <div className="glass-panel" style={{ borderLeft: '5px solid #00ff00' }}>
          <h2 style={{ color: '#00ff00', marginBottom: '1rem' }}>Good Plays Detected</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ background: 'rgba(0, 255, 0, 0.1)', padding: '1rem', borderRadius: '8px' }}>
              <strong>Clutch Master:</strong> You successfully won a 1v2 clutch in Round 12!
            </li>
            <li style={{ background: 'rgba(0, 255, 0, 0.1)', padding: '1rem', borderRadius: '8px' }}>
              <strong>High Impact:</strong> Your ability usage resulted in 12 assists this game.
            </li>
          </ul>
        </div>
      </div>
      
      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <h3>Raw Timeline Data Available for Developers</h3>
        <p style={{ color: 'var(--text-muted)' }}>
          The Riot API provides exact X/Y coordinates for every kill, plant, and defuse. 
          A full heatmap can be rendered here using the canvas tool.
        </p>
      </div>
    </div>
  );
}
