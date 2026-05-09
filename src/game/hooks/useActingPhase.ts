import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { boardDefinition } from '../board/boardDefinition';
import { isPropertyBuyable, getPropertyPrice } from '../logic/buyProperty';

export function useActingPhase() {
  const { turnPhase, currentPlayerIndex, players, properties, propertyForSaleIndex } =
    useGameStore();

  useEffect(() => {
    if (turnPhase !== 'acting' || propertyForSaleIndex !== undefined) {
      return;
    }

    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer) {
      return;
    }

    const tile = boardDefinition.tiles[currentPlayer.tileIndex];
    if (!tile) {
      return;
    }

    // Check if it's a buyable property
    if (
      (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility') &&
      isPropertyBuyable(currentPlayer.tileIndex, properties)
    ) {
      const price = getPropertyPrice(currentPlayer.tileIndex);
      if (price !== null && currentPlayer.money >= price) {
        // Show buy dialog
        useGameStore.setState({ propertyForSaleIndex: currentPlayer.tileIndex });
      } else {
        // Can't afford, end turn
        useGameStore.setState({ turnPhase: 'end-turn' });
      }
    } else {
      // Not a property or already owned, end turn
      useGameStore.setState({ turnPhase: 'end-turn' });
    }
  }, [turnPhase, currentPlayerIndex, players, properties, propertyForSaleIndex]);
}
