import { useGameStore } from '../../game/store/gameStore';

export default function RollDiceButton() {
  const { rollDice, turnPhase, players } = useGameStore();

  const isDisabled = turnPhase !== 'idle' || players.length === 0;

  return (
    <button
      onClick={() => rollDice()}
      disabled={isDisabled}
      style={{
        position: 'absolute',
        bottom: 40,
        right: 40,
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#f8fafc',
        background: isDisabled ? '#cbd5e1' : '#3b82f6',
        border: 'none',
        borderRadius: '8px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.3s ease',
        zIndex: 20,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          (e.target as HTMLButtonElement).style.background = '#1d4ed8';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          (e.target as HTMLButtonElement).style.background = '#3b82f6';
        }
      }}
    >
      Lancer les dés
    </button>
  );
}
