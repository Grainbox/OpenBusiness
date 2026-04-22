import { useEffect, useState } from 'react';
import { useGameStore } from '../../game/store/gameStore';
import { GO_REWARD } from '../../game/logic/goReward';

export default function GoRewardNotification() {
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const [showNotification, setShowNotification] = useState(false);
  const [prevMoney, setPrevMoney] = useState<number | null>(null);

  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    if (!currentPlayer) return;

    // Check if player money increased by GO_REWARD
    if (prevMoney !== null && currentPlayer.money === prevMoney + GO_REWARD) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

    setPrevMoney(currentPlayer.money);
  }, [currentPlayer?.money, prevMoney, currentPlayer]);

  if (!showNotification) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 30,
        padding: '16px 24px',
        background: '#10b981',
        color: 'white',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        animation: 'slideDown 0.3s ease-out, slideUp 0.3s ease-out 1.7s',
      }}
    >
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
        }
      `}</style>
      Vous passez par Départ : +{GO_REWARD} €
    </div>
  );
}
