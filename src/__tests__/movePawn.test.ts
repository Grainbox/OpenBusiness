import { describe, it, expect } from 'vitest';
import { movePawnProgressive } from '../game/logic/movePawn';

describe('Move Pawn Logic', () => {
  it('should move pawn sequentially through tiles', async () => {
    const moveSequence: number[] = [];

    await movePawnProgressive(0, 5, {
      onStepMove: (tileIndex: number) => {
        moveSequence.push(tileIndex);
      },
    });

    expect(moveSequence).toEqual([1, 2, 3, 4, 5]);
  });

  it('should wrap around board (40 tiles)', async () => {
    const moveSequence: number[] = [];

    await movePawnProgressive(38, 5, {
      onStepMove: (tileIndex: number) => {
        moveSequence.push(tileIndex);
      },
    });

    expect(moveSequence).toEqual([39, 0, 1, 2, 3]);
  });

  it('should detect passing Go', async () => {
    let passedGo = false;

    await movePawnProgressive(38, 5, {
      onStepMove: () => {},
      onPassedGo: () => {
        passedGo = true;
      },
    });

    expect(passedGo).toBe(true);
  });

  it('should not detect passing Go when not wrapping', async () => {
    let passedGo = false;

    await movePawnProgressive(5, 3, {
      onStepMove: () => {},
      onPassedGo: () => {
        passedGo = true;
      },
    });

    expect(passedGo).toBe(false);
  });

  it('should move exactly the specified number of spaces', async () => {
    const moveSequence: number[] = [];

    await movePawnProgressive(10, 7, {
      onStepMove: (tileIndex: number) => {
        moveSequence.push(tileIndex);
      },
    });

    expect(moveSequence.length).toBe(7);
    expect(moveSequence[moveSequence.length - 1]).toBe(17);
  });

  it('should handle moving from Go (index 0)', async () => {
    const moveSequence: number[] = [];

    await movePawnProgressive(0, 6, {
      onStepMove: (tileIndex: number) => {
        moveSequence.push(tileIndex);
      },
    });

    expect(moveSequence).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should complete movement in reasonable time', async () => {
    const start = Date.now();

    await movePawnProgressive(0, 3, {
      onStepMove: () => {},
    });

    const duration = Date.now() - start;
    // 3 moves * 250ms = 750ms, with some tolerance
    expect(duration).toBeGreaterThanOrEqual(700);
    expect(duration).toBeLessThan(1000);
  });
});
