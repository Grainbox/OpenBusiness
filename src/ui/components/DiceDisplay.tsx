import { useGameStore } from '../../game/store/gameStore';
import { useEffect, useState } from 'react';

export default function DiceDisplay() {
  const { dice, turnPhase } = useGameStore();
  const [isShaking, setIsShaking] = useState(false);

  const isIdle = turnPhase === 'idle';
  const hasRolled = dice !== null;

  // Trigger shake animation when dice appear
  useEffect(() => {
    if (hasRolled && !isShaking) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 600);
      return () => clearTimeout(timer);
    }
  }, [dice, hasRolled, isShaking]);

  const isDouble = dice && dice[0] === dice[1];

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        textAlign: 'center',
      }}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-2px, -2px) rotate(-2deg); }
          20% { transform: translate(2px, 2px) rotate(2deg); }
          30% { transform: translate(-2px, 2px) rotate(-2deg); }
          40% { transform: translate(2px, -2px) rotate(2deg); }
          50% { transform: translate(-1px, -1px) rotate(-1deg); }
          60% { transform: translate(1px, 1px) rotate(1deg); }
          70% { transform: translate(-1px, 1px) rotate(-1deg); }
          80% { transform: translate(1px, -1px) rotate(1deg); }
          90% { transform: translate(0, 0) rotate(0deg); }
        }

        .dice-container {
          display: flex;
          gap: 20px;
          justify-content: center;
          align-items: center;
        }

        .die {
          width: 60px;
          height: 60px;
          background: white;
          border: 3px solid #1e293b;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: bold;
          color: #1e293b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .die.shaking {
          animation: shake 600ms ease-in-out;
        }

        .double-label {
          margin-top: 16px;
          padding: 8px 16px;
          background: #10b981;
          color: white;
          border-radius: 6px;
          font-weight: bold;
          font-size: 14px;
          animation: fadeIn 0.4s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .disabled {
          opacity: 0.5;
          pointer-events: none;
        }
      `}</style>

      {hasRolled && (
        <div className={!isIdle ? 'disabled' : ''}>
          <div className="dice-container">
            <div className={`die ${isShaking ? 'shaking' : ''}`}>
              {dice[0]}
            </div>
            <div className={`die ${isShaking ? 'shaking' : ''}`}>
              {dice[1]}
            </div>
          </div>
          {isDouble && <div className="double-label">Double !</div>}
        </div>
      )}
    </div>
  );
}
