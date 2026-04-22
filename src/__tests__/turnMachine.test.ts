import { describe, it, expect } from 'vitest';
import { isValidTransition, canTransitionTo } from '../game/store/turnMachine';

describe('Turn Machine', () => {
  it('should allow valid transitions from idle', () => {
    expect(isValidTransition('idle', 'rolling')).toBe(true);
  });

  it('should reject invalid transitions from idle', () => {
    expect(isValidTransition('idle', 'moving')).toBe(false);
    expect(isValidTransition('idle', 'acting')).toBe(false);
    expect(isValidTransition('idle', 'end-turn')).toBe(false);
    expect(isValidTransition('idle', 'idle')).toBe(false);
  });

  it('should allow valid transitions from rolling', () => {
    expect(isValidTransition('rolling', 'moving')).toBe(true);
  });

  it('should reject invalid transitions from rolling', () => {
    expect(isValidTransition('rolling', 'idle')).toBe(false);
    expect(isValidTransition('rolling', 'acting')).toBe(false);
    expect(isValidTransition('rolling', 'end-turn')).toBe(false);
  });

  it('should allow valid transitions from moving', () => {
    expect(isValidTransition('moving', 'acting')).toBe(true);
  });

  it('should reject invalid transitions from moving', () => {
    expect(isValidTransition('moving', 'idle')).toBe(false);
    expect(isValidTransition('moving', 'rolling')).toBe(false);
    expect(isValidTransition('moving', 'end-turn')).toBe(false);
  });

  it('should allow valid transitions from acting', () => {
    expect(isValidTransition('acting', 'end-turn')).toBe(true);
  });

  it('should reject invalid transitions from acting', () => {
    expect(isValidTransition('acting', 'idle')).toBe(false);
    expect(isValidTransition('acting', 'rolling')).toBe(false);
    expect(isValidTransition('acting', 'moving')).toBe(false);
  });

  it('should allow valid transitions from end-turn', () => {
    expect(isValidTransition('end-turn', 'idle')).toBe(true);
  });

  it('should reject invalid transitions from end-turn', () => {
    expect(isValidTransition('end-turn', 'rolling')).toBe(false);
    expect(isValidTransition('end-turn', 'moving')).toBe(false);
    expect(isValidTransition('end-turn', 'acting')).toBe(false);
  });

  it('should allow no transitions from game-over', () => {
    expect(isValidTransition('game-over', 'idle')).toBe(false);
    expect(isValidTransition('game-over', 'rolling')).toBe(false);
    expect(isValidTransition('game-over', 'moving')).toBe(false);
    expect(isValidTransition('game-over', 'acting')).toBe(false);
    expect(isValidTransition('game-over', 'end-turn')).toBe(false);
    expect(isValidTransition('game-over', 'game-over')).toBe(false);
  });

  it('canTransitionTo should be an alias for isValidTransition', () => {
    const transitions = [
      ['idle', 'rolling'],
      ['rolling', 'moving'],
      ['moving', 'acting'],
      ['acting', 'end-turn'],
      ['end-turn', 'idle'],
      ['idle', 'moving'],
      ['rolling', 'idle'],
    ] as const;

    transitions.forEach(([from, to]) => {
      expect(canTransitionTo(from, to)).toBe(isValidTransition(from, to));
    });
  });
});
