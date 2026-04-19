import { describe, it, expect } from 'vitest';
import { boardDefinition } from '../game/board/boardDefinition';
import { PROPERTY_GROUPS } from '../game/board/propertyGroups';

const CORNER_INDICES = [0, 10, 20, 30];

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
        .filter((group): group is string => Boolean(group))
    );

    for (const group of PROPERTY_GROUPS) {
      expect(groups.has(group)).toBe(true);
    }
  });
});
