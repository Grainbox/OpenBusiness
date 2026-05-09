import { describe, it, expect } from 'vitest';
import {
  canBuyProperty,
  executePropertyPurchase,
  getPropertyPrice,
  isPropertyBuyable,
} from '../game/logic/buyProperty';
import type { Player, PropertyState } from '../game/types';

describe('buyProperty', () => {
  const mockPlayer = (money: number = 300): Player => ({
    id: '0',
    name: 'Test Player',
    color: '#ef4444',
    tileIndex: 1,
    money,
    bankrupt: false,
  });

  describe('getPropertyPrice', () => {
    it('should return price for property tiles', () => {
      expect(getPropertyPrice(1)).toBe(60); // Rue Alpha
      expect(getPropertyPrice(3)).toBe(60); // Rue Beta
      expect(getPropertyPrice(6)).toBe(100); // Rue Gamma
    });

    it('should return price for railroad tiles', () => {
      expect(getPropertyPrice(5)).toBe(200); // Gare Nord
    });

    it('should return price for utility tiles', () => {
      expect(getPropertyPrice(12)).toBe(150); // Compagnie Electrique
    });

    it('should return null for non-property tiles', () => {
      expect(getPropertyPrice(0)).toBeNull(); // Go
      expect(getPropertyPrice(2)).toBeNull(); // Caisse Communaute
      expect(getPropertyPrice(4)).toBeNull(); // Taxe Locale
    });
  });

  describe('isPropertyBuyable', () => {
    it('should return true for unowned properties', () => {
      const properties: Record<number, PropertyState> = {};
      expect(isPropertyBuyable(1, properties)).toBe(true);
    });

    it('should return false for owned properties', () => {
      const properties: Record<number, PropertyState> = {
        1: { ownerId: '0', mortgaged: false },
      };
      expect(isPropertyBuyable(1, properties)).toBe(false);
    });

    it('should return false for non-property tiles', () => {
      const properties: Record<number, PropertyState> = {};
      expect(isPropertyBuyable(0, properties)).toBe(false);
      expect(isPropertyBuyable(2, properties)).toBe(false);
    });
  });

  describe('canBuyProperty', () => {
    it('should allow purchase with sufficient funds', () => {
      const player = mockPlayer(300);
      const properties: Record<number, PropertyState> = {};
      const result = canBuyProperty(1, player, properties); // Rue Alpha costs 60
      expect(result.canBuy).toBe(true);
    });

    it('should prevent purchase with insufficient funds', () => {
      const player = mockPlayer(50);
      const properties: Record<number, PropertyState> = {};
      const result = canBuyProperty(1, player, properties); // Rue Alpha costs 60
      expect(result.canBuy).toBe(false);
      expect(result.reason).toBe('Insufficient funds');
    });

    it('should prevent purchase of already owned properties', () => {
      const player = mockPlayer(300);
      const properties: Record<number, PropertyState> = {
        1: { ownerId: '1' },
      };
      const result = canBuyProperty(1, player, properties);
      expect(result.canBuy).toBe(false);
      expect(result.reason).toBe('Property is already owned');
    });

    it('should prevent purchase of non-property tiles', () => {
      const player = mockPlayer(300);
      const properties: Record<number, PropertyState> = {};
      const result = canBuyProperty(0, player, properties); // Go tile
      expect(result.canBuy).toBe(false);
      expect(result.reason).toBe('Tile is not a property');
    });

    it('should allow exact amount purchase', () => {
      const player = mockPlayer(60);
      const properties: Record<number, PropertyState> = {};
      const result = canBuyProperty(1, player, properties); // Rue Alpha costs 60
      expect(result.canBuy).toBe(true);
    });
  });

  describe('executePropertyPurchase', () => {
    it('should deduct price and register owner', () => {
      const properties: Record<number, PropertyState> = {};
      const { updatedProperties, updatedMoney } = executePropertyPurchase(
        '0',
        1, // Rue Alpha costs 60
        properties,
        300
      );

      expect(updatedMoney).toBe(240);
      expect(updatedProperties[1]).toEqual({
        ownerId: '0',
        mortgaged: false,
        houses: 0,
        hotels: 0,
      });
    });

    it('should handle multiple property purchases', () => {
      let properties: Record<number, PropertyState> = {};
      let money = 500;

      // Purchase Rue Alpha
      const purchase1 = executePropertyPurchase('0', 1, properties, money);
      properties = purchase1.updatedProperties;
      money = purchase1.updatedMoney;

      expect(money).toBe(440);
      expect(properties[1].ownerId).toBe('0');

      // Purchase Rue Beta
      const purchase2 = executePropertyPurchase('0', 3, properties, money);
      properties = purchase2.updatedProperties;
      money = purchase2.updatedMoney;

      expect(money).toBe(380);
      expect(properties[3].ownerId).toBe('0');
    });

    it('should not modify invalid tiles', () => {
      const properties: Record<number, PropertyState> = {};
      const { updatedProperties, updatedMoney } = executePropertyPurchase(
        '0',
        0, // Go tile (invalid)
        properties,
        300
      );

      expect(updatedMoney).toBe(300);
      expect(updatedProperties[0]).toBeUndefined();
    });
  });
});
