import { describe, it, expect } from 'vitest';
import { boardDefinition } from '../game/board/boardDefinition';
import { PROPERTY_GROUPS } from '../game/board/propertyGroups';

const CORNER_INDICES = [0, 10, 20, 30];
const BUYABLE_TYPES = ['property', 'railroad', 'utility'] as const;

describe('boardDefinition', () => {
  it('should define 40 tiles', () => {
    expect(boardDefinition.tiles).toHaveLength(40);
  });

  it('should include the four corner tiles at expected indices', () => {
    const cornerNames = CORNER_INDICES.map((index) => boardDefinition.tiles[index]?.name);
    expect(cornerNames).toEqual(['Depart', 'Prison / Visite', 'Parking Gratuit', 'Aller en Prison']);
  });

  it('should include at least one tile per property group', () => {
    const groups = new Set(
      boardDefinition.tiles
        .map((tile) => tile.group)
        .filter(Boolean)
    );

    for (const group of PROPERTY_GROUPS) {
      expect(groups.has(group)).toBe(true);
    }
  });

  describe('Données Métier', () => {
    it('should have each tile with a unique index from 0 to 39', () => {
      const indices = new Set(boardDefinition.tiles.map((tile) => tile.index));
      expect(indices.size).toBe(40);
      expect(Math.min(...boardDefinition.tiles.map((tile) => tile.index))).toBe(0);
      expect(Math.max(...boardDefinition.tiles.map((tile) => tile.index))).toBe(39);
    });

    it('should have all buyable tiles with a valid price', () => {
      const buyableTiles = boardDefinition.tiles.filter((tile) =>
        BUYABLE_TYPES.includes(tile.type as typeof BUYABLE_TYPES[number])
      );

      buyableTiles.forEach((tile) => {
        expect(tile.price).toBeDefined();
        expect(typeof tile.price).toBe('number');
        expect(tile.price).toBeGreaterThan(0);
      });

      expect(buyableTiles.length).toBeGreaterThan(0);
    });

    it('should have all tiles with known types (no unknown values)', () => {
      const validTypes = [
        'go',
        'property',
        'tax',
        'chance',
        'community',
        'jail',
        'free-parking',
        'go-to-jail',
        'utility',
        'railroad',
      ];

      boardDefinition.tiles.forEach((tile) => {
        expect(validTypes).toContain(tile.type);
      });
    });

    it('should have property groups coherent and complete', () => {
      const propertyTiles = boardDefinition.tiles.filter((tile) => tile.type === 'property');
      const railroadTiles = boardDefinition.tiles.filter((tile) => tile.type === 'railroad');
      const utilityTiles = boardDefinition.tiles.filter((tile) => tile.type === 'utility');

      propertyTiles.forEach((tile) => {
        expect(tile.group).toBeDefined();
        expect(['brown', 'lightBlue', 'pink', 'orange', 'red', 'yellow', 'green', 'blue']).toContain(
          tile.group
        );
      });

      railroadTiles.forEach((tile) => {
        expect(tile.group).toBe('railroad');
      });

      utilityTiles.forEach((tile) => {
        expect(tile.group).toBe('utility');
      });

      expect(railroadTiles.length).toBe(4);
      expect(utilityTiles.length).toBe(2);
    });
  });
});
