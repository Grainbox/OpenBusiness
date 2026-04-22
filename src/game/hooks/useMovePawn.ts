import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { getTotalValue } from '../logic/dice';

export function useMovePawn() {
  const { turnPhase, dice, currentPlayerIndex, movePawnProgressive } =
    useGameStore();
  const movementInProgress = useRef(false);

  useEffect(() => {
    // Only move when in 'moving' phase and we have dice, and no movement in progress
    if (turnPhase === 'moving' && dice && !movementInProgress.current) {
      movementInProgress.current = true;
      const spacesToMove = getTotalValue(dice);
      const playerId = String(currentPlayerIndex);

      // Trigger movement
      movePawnProgressive(playerId, spacesToMove).then(() => {
        movementInProgress.current = false;
      });
    }
  }, [turnPhase, dice, currentPlayerIndex, movePawnProgressive]);
}
