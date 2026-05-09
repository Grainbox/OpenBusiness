import { boardDefinition } from '../board/boardDefinition';
import type { Player, PropertyState } from '../types';

export interface BuyPropertyResult {
  canBuy: boolean;
  reason?: string;
}

export function getPropertyPrice(tileIndex: number): number | null {
  const tile = boardDefinition.tiles[tileIndex];
  if (!tile || tile.type !== 'property' && tile.type !== 'railroad' && tile.type !== 'utility') {
    return null;
  }
  return tile.price ?? null;
}

export function isPropertyBuyable(tileIndex: number, properties: Record<number, PropertyState>): boolean {
  const tile = boardDefinition.tiles[tileIndex];
  if (!tile || (tile.type !== 'property' && tile.type !== 'railroad' && tile.type !== 'utility')) {
    return false;
  }
  return !properties[tileIndex]?.ownerId;
}

export function canBuyProperty(
  tileIndex: number,
  player: Player,
  properties: Record<number, PropertyState>
): BuyPropertyResult {
  // Check if tile is a property/railroad/utility
  const price = getPropertyPrice(tileIndex);
  if (price === null) {
    return { canBuy: false, reason: 'Tile is not a property' };
  }

  // Check if property is already owned
  if (!isPropertyBuyable(tileIndex, properties)) {
    return { canBuy: false, reason: 'Property is already owned' };
  }

  // Check if player has enough money
  if (player.money < price) {
    return { canBuy: false, reason: 'Insufficient funds' };
  }

  return { canBuy: true };
}

export function executePropertyPurchase(
  playerId: string,
  tileIndex: number,
  properties: Record<number, PropertyState>,
  playerMoney: number
): { updatedProperties: Record<number, PropertyState>; updatedMoney: number } {
  const price = getPropertyPrice(tileIndex);
  if (price === null) {
    return { updatedProperties: properties, updatedMoney: playerMoney };
  }

  const updatedProperties = { ...properties };
  updatedProperties[tileIndex] = {
    ownerId: playerId,
    mortgaged: false,
    houses: 0,
    hotels: 0,
  };

  return {
    updatedProperties,
    updatedMoney: playerMoney - price,
  };
}
