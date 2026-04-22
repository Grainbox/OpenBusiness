import { describe, it, expect } from 'vitest';
import { useGameStore } from '../game/store/gameStore';

describe('Game Store', () => {
  it('should initialize with phase "playing"', () => {
    const state = useGameStore.getState();
    expect(state.phase).toBe('playing');
  });

  it('should initialize with 4 players on go tile', () => {
    const state = useGameStore.getState();
    expect(state.players).toHaveLength(4);
    state.players.forEach((player) => {
      expect(player.tileIndex).toBe(0);
      expect(player.money).toBe(1500);
      expect(player.color).toBeDefined();
    });
  });
});
