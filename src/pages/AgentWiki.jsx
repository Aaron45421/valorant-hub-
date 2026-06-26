import { useState, useEffect } from 'react';
import { getAgents } from '../services/valApi';

export default function AgentWiki() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const data = await getAgents();
        // Sort by name
        data.sort((a, b) => a.displayName.localeCompare(b.displayName));
        setAgents(data);
        if (data.length > 0) setSelectedAgent(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Agents...</div>;

  return (
    <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
      
      {/* Sidebar: Agent List */}
      <div className="glass-panel" style={{ width: '300px', height: '80vh', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--val-red)' }}>Agents</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {agents.map(agent => (
            <div 
              key={agent.uuid}
              onClick={() => setSelectedAgent(agent)}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: selectedAgent?.uuid === agent.uuid ? 'var(--val-red)' : 'rgba(0,0,0,0.3)',
                transition: 'var(--transition)'
              }}
            >
              <img src={agent.displayIconSmall} alt={agent.displayName} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              <span style={{ fontWeight: 'bold' }}>{agent.displayName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Agent Details */}
      {selectedAgent && (
        <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* Faded Background */}
          <img 
            src={selectedAgent.background} 
            alt="bg" 
            style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1, zIndex: 0, height: '100%', objectFit: 'cover' }} 
          />
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '2rem' }}>
            {/* Portrait */}
            <div style={{ flex: 1 }}>
              <img 
                src={selectedAgent.fullPortraitV2} 
                alt={selectedAgent.displayName} 
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
              />
            </div>
            
            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>{selectedAgent.displayName}</h1>
                {selectedAgent.role && (
                  <img src={selectedAgent.role.displayIcon} alt={selectedAgent.role.displayName} style={{ width: '40px', height: '40px', filter: 'invert(1)' }} title={selectedAgent.role.displayName} />
                )}
              </div>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                {selectedAgent.description}
              </p>
              
              <h3 style={{ marginBottom: '1rem', color: 'var(--val-red)' }}>Abilities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedAgent.abilities.map(ability => (
                  <div key={ability.slot} style={{ display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ background: 'var(--bg-dark)', padding: '0.5rem', borderRadius: '8px', height: 'fit-content' }}>
                      {ability.displayIcon ? (
                        <img src={ability.displayIcon} alt={ability.displayName} style={{ width: '40px', height: '40px', filter: 'invert(1)' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</div>
                      )}
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.25rem' }}>
                        {ability.displayName} <span style={{ color: 'var(--val-red)', fontSize: '0.8rem' }}>({ability.slot})</span>
                      </strong>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{ability.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
