import { describe, it, expect } from 'vitest';
import { generateBoardPath } from '../game/board/generateBoardPath';

describe('generateBoardPath', () => {
  it('should generate 40 positions for a 11x11 board', () => {
    const positions = generateBoardPath(11, 1);
    expect(positions).toHaveLength(40);
  });

  it('should generate unique positions', () => {
    const positions = generateBoardPath(11, 1);
    const unique = new Set(positions.map((position) => position.join(',')));
    expect(unique.size).toBe(40);
  });
});
