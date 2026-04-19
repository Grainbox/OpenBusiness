import { describe, it, expect } from 'vitest';
import { useGameStore } from '../game/store/gameStore';

describe('Game Store', () => {
  it('should initialize with phase "menu"', () => {
    const state = useGameStore.getState();
    expect(state.phase).toBe('menu');
  });

  it('should initialize with empty players array', () => {
    const state = useGameStore.getState();
    expect(state.players).toEqual([]);
  });
});
