import { useState } from 'react';
import GameCanvas from './r3f/GameCanvas';

function App() {
  const [showAllLabels, setShowAllLabels] = useState(false);
  const isDev = import.meta.env.DEV;

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {isDev && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            padding: '8px 10px',
            background: 'rgba(15, 23, 42, 0.85)',
            color: '#f8fafc',
            borderRadius: 8,
            fontSize: 12,
            zIndex: 10,
          }}
        >
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={showAllLabels}
              onChange={(event) => setShowAllLabels(event.target.checked)}
            />
            Afficher tous les labels
          </label>
        </div>
      )}
      <GameCanvas showAllLabels={showAllLabels} />
    </div>
  );
}

export default App;
