import { useGameStore } from '../../game/store/gameStore';

export default function ResetDiceButton() {
  const { dice, resetDiceRoll } = useGameStore();

  const hasRolled = dice !== null;

  if (!hasRolled) return null;

  return (
    <button
      onClick={() => {
        resetDiceRoll();
      }}
      style={{
        position: 'absolute',
        bottom: 40,
        left: 40,
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#f8fafc',
        background: '#ef4444',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
        zIndex: 20,
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLButtonElement).style.background = '#dc2626';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLButtonElement).style.background = '#ef4444';
      }}
    >
      Relancer
    </button>
  );
}
