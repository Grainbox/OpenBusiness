import { describe, it, expect } from 'vitest';
import { getPawnOffsets, validatePawnOffsets } from '../game/board/getPawnOffsets';

describe('getPawnOffsets', () => {
  it('returns correct number of offsets for 1-6 players', () => {
    for (let i = 1; i <= 6; i++) {
      const offsets = getPawnOffsets(i);
      expect(offsets).toHaveLength(i);
    }
  });

  it('clamps to 1 minimum', () => {
    const offsets = getPawnOffsets(0);
    expect(offsets).toHaveLength(1);
  });

  it('clamps to 6 maximum', () => {
    const offsets = getPawnOffsets(10);
    expect(offsets).toHaveLength(6);
  });

  it('returns deterministic offsets (same call = same result)', () => {
    const offsets1 = getPawnOffsets(4);
    const offsets2 = getPawnOffsets(4);
    expect(offsets1).toEqual(offsets2);
  });

  it('validates pawn spacing without overlap', () => {
    for (let i = 1; i <= 6; i++) {
      const offsets = getPawnOffsets(i);
      expect(validatePawnOffsets(offsets)).toBe(true);
    }
  });

  it('includes center [0, 0] for single player', () => {
    const offsets = getPawnOffsets(1);
    expect(offsets[0]).toEqual([0, 0]);
  });
});
