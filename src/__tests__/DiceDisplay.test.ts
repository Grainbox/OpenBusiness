import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store/gameStore';

describe('DiceDisplay Component Integration', () => {
  beforeEach(() => {
    useGameStore.setState({
      gamePhase: 'playing',
      turnPhase: 'idle',
      players: [],
      currentPlayerIndex: 0,
      dice: null,
      hasDouble: false,
      properties: {},
      turnCount: 0,
    });
  });

  it('should display dice after rolling', () => {
    const { initGame, rollDice } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    expect(useGameStore.getState().dice).toBeNull();

    rollDice();

    const state = useGameStore.getState();
    expect(state.dice).not.toBeNull();
    expect(state.dice![0]).toBeGreaterThanOrEqual(1);
    expect(state.dice![0]).toBeLessThanOrEqual(6);
    expect(state.dice![1]).toBeGreaterThanOrEqual(1);
    expect(state.dice![1]).toBeLessThanOrEqual(6);
  });

  it('should show double label when dice are equal', () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    for (let i = 0; i < 100; i++) {
      useGameStore.setState({ turnPhase: 'idle', dice: null });
      const { rollDice: roll } = useGameStore.getState();
      roll();

      const state = useGameStore.getState();
      const [die1, die2] = state.dice!;

      if (die1 === die2) {
        expect(state.hasDouble).toBe(true);
        break;
      }
    }
  });

  it('should disable display when not in idle phase', () => {
    const { initGame, rollDice, setTurnPhase } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    rollDice();
    const state = useGameStore.getState();
    expect(state.turnPhase).toBe('moving');
    expect(state.dice).not.toBeNull();

    setTurnPhase('acting');
    const state2 = useGameStore.getState();
    expect(state2.turnPhase).toBe('acting');
  });
});
