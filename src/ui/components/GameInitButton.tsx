import { useGameStore } from '../../game/store/gameStore';

export default function GameInitButton() {
  const { players, initGame } = useGameStore();

  const hasPlayers = players.length > 0;

  return (
    <button
      onClick={() => initGame(['Joueur 1', 'Joueur 2'])}
      style={{
        position: 'absolute',
        top: 60,
        right: 40,
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#f8fafc',
        background: hasPlayers ? '#cbd5e1' : '#10b981',
        border: 'none',
        borderRadius: '8px',
        cursor: hasPlayers ? 'not-allowed' : 'pointer',
        transition: 'background 0.3s ease',
        zIndex: 20,
      }}
      disabled={hasPlayers}
      onMouseEnter={(e) => {
        if (!hasPlayers) {
          (e.target as HTMLButtonElement).style.background = '#059669';
        }
      }}
      onMouseLeave={(e) => {
        if (!hasPlayers) {
          (e.target as HTMLButtonElement).style.background = '#10b981';
        }
      }}
    >
      {hasPlayers ? 'Partie démarrée' : 'Démarrer la partie'}
    </button>
  );
}
