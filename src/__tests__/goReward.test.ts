import { describe, it, expect } from 'vitest';
import { detectGoPassage, GO_REWARD } from '../game/logic/goReward';

describe('Go Reward Logic', () => {
  it('should export correct Go reward amount', () => {
    expect(GO_REWARD).toBe(200);
  });

  it('should detect passing Go from tile 38 with 5 moves', () => {
    const result = detectGoPassage(38, 5);
    expect(result.passageOccurred).toBe(true);
    expect(result.tilesCrossed).toContain(0);
  });

  it('should not detect passing Go when staying on board', () => {
    const result = detectGoPassage(5, 3);
    expect(result.passageOccurred).toBe(false);
    expect(result.tilesCrossed).not.toContain(0);
  });

  it('should track all tiles crossed', () => {
    const result = detectGoPassage(38, 5);
    expect(result.tilesCrossed).toEqual([39, 0, 1, 2, 3]);
  });

  it('should detect passing Go from tile 35 with 10 moves', () => {
    const result = detectGoPassage(35, 10);
    expect(result.passageOccurred).toBe(true);
  });

  it('should not detect passing Go from tile 0 with 5 moves', () => {
    const result = detectGoPassage(0, 5);
    expect(result.passageOccurred).toBe(false);
    expect(result.tilesCrossed).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle wrapping multiple times on large move', () => {
    const result = detectGoPassage(30, 50);
    expect(result.passageOccurred).toBe(true);
    expect(result.tilesCrossed.length).toBe(50);
  });

  it('should correctly identify exact landing on Go', () => {
    const result = detectGoPassage(39, 1);
    expect(result.passageOccurred).toBe(true);
    expect(result.tilesCrossed).toEqual([0]);
  });
});
