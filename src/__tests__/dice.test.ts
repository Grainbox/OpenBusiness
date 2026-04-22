import { describe, it, expect } from 'vitest';
import { rollDice, isDouble, getTotalValue } from '../game/logic/dice';

describe('Dice Logic', () => {
  it('should roll two dice between 1 and 6', () => {
    for (let i = 0; i < 100; i++) {
      const [die1, die2] = rollDice();
      expect(die1).toBeGreaterThanOrEqual(1);
      expect(die1).toBeLessThanOrEqual(6);
      expect(die2).toBeGreaterThanOrEqual(1);
      expect(die2).toBeLessThanOrEqual(6);
    }
  });

  it('should detect doubles correctly', () => {
    expect(isDouble([1, 1])).toBe(true);
    expect(isDouble([6, 6])).toBe(true);
    expect(isDouble([3, 3])).toBe(true);
    expect(isDouble([1, 2])).toBe(false);
    expect(isDouble([5, 6])).toBe(false);
    expect(isDouble([3, 4])).toBe(false);
  });

  it('should return correct total value', () => {
    expect(getTotalValue([1, 1])).toBe(2);
    expect(getTotalValue([6, 6])).toBe(12);
    expect(getTotalValue([3, 4])).toBe(7);
    expect(getTotalValue([1, 6])).toBe(7);
  });

  it('should have fair distribution of doubles over many rolls', () => {
    const rolls = 10000;
    let doubleCount = 0;

    for (let i = 0; i < rolls; i++) {
      const dice = rollDice();
      if (isDouble(dice)) {
        doubleCount++;
      }
    }

    const doublePercentage = (doubleCount / rolls) * 100;
    const expectedPercentage = 100 / 6;

    expect(doublePercentage).toBeGreaterThan(expectedPercentage - 2);
    expect(doublePercentage).toBeLessThan(expectedPercentage + 2);
  });

  it('should have fair distribution of each die value', () => {
    const rolls = 6000;
    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };

    for (let i = 0; i < rolls; i++) {
      const [die1, die2] = rollDice();
      distribution[die1]++;
      distribution[die2]++;
    }

    const expectedFrequency = rolls / 3;
    Object.values(distribution).forEach((count) => {
      expect(count).toBeGreaterThan(expectedFrequency - 200);
      expect(count).toBeLessThan(expectedFrequency + 200);
    });
  });
});
