import { useState, useEffect, useRef } from 'react';
import { getMaps } from '../services/valApi';

export default function MapTool() {
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    async function fetchMaps() {
      try {
        const data = await getMaps();
        // Filter out The Range / Training maps if possible, or just show all
        const playableMaps = data.filter(m => m.displayIcon !== null);
        setMaps(playableMaps);
        if (playableMaps.length > 0) setSelectedMap(playableMaps[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMaps();
  }, []);

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = '#ff4655';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Maps...</div>;

  return (
    <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
      
      {/* Sidebar: Map List */}
      <div className="glass-panel" style={{ width: '300px', height: '80vh', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--val-red)' }}>Maps</h2>
        <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
          {maps.map(map => (
            <div 
              key={map.uuid}
              onClick={() => {
                setSelectedMap(map);
                clearCanvas();
              }}
              style={{
                position: 'relative',
                height: '100px',
                borderRadius: '8px',
                cursor: 'pointer',
                overflow: 'hidden',
                border: selectedMap?.uuid === map.uuid ? '2px solid var(--val-red)' : '2px solid transparent'
              }}
            >
              <img 
                src={map.listViewIcon || map.splash} 
                alt={map.displayName} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, width: '100%', 
                background: 'rgba(0,0,0,0.7)', padding: '0.25rem', textAlign: 'center',
                fontWeight: 'bold'
              }}>
                {map.displayName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Map Planner */}
      {selectedMap && (
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
            <h1 style={{ color: 'var(--val-red)' }}>{selectedMap.displayName} Tracker Planner</h1>
            <button className="btn" onClick={clearCanvas}>Clear Drawings</button>
          </div>
          
          <p style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Draw directly on the map to plan strategies.
          </p>

          <div style={{ position: 'relative', width: '600px', height: '600px', background: 'var(--bg-dark)', borderRadius: '12px', overflow: 'hidden' }}>
            <img 
              src={selectedMap.displayIcon} 
              alt={selectedMap.displayName} 
              style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', pointerEvents: 'none' }}
              draggable="false"
            />
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              style={{ position: 'absolute', top: 0, left: 0, cursor: 'crosshair', zIndex: 10 }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
            />
          </div>
        </div>
      )}
    </div>
  );
}
