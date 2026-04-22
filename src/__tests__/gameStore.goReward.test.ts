import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store/gameStore';
import { GO_REWARD } from '../game/logic/goReward';

describe('Game Store - Go Reward', () => {
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

  it('should apply Go reward when player passes Go', async () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    // Place player at tile 38
    useGameStore.setState({
      players: useGameStore.getState().players.map((p) =>
        p.id === '0' ? { ...p, tileIndex: 38 } : p
      ),
    });

    const initialMoney = useGameStore.getState().players[0].money;

    const { movePawnProgressive } = useGameStore.getState();
    await movePawnProgressive('0', 5);

    const state = useGameStore.getState();
    expect(state.players[0].money).toBe(initialMoney + GO_REWARD);
    expect(state.players[0].tileIndex).toBe(3);
  });

  it('should not apply Go reward when player does not pass Go', async () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    const initialMoney = useGameStore.getState().players[0].money;

    const { movePawnProgressive } = useGameStore.getState();
    await movePawnProgressive('0', 3);

    const state = useGameStore.getState();
    expect(state.players[0].money).toBe(initialMoney);
    expect(state.players[0].tileIndex).toBe(3);
  });

  it('should apply Go reward only once per passage', async () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    // Place player at tile 35
    useGameStore.setState({
      players: useGameStore.getState().players.map((p) =>
        p.id === '0' ? { ...p, tileIndex: 35 } : p
      ),
    });

    const initialMoney = useGameStore.getState().players[0].money;

    const { movePawnProgressive } = useGameStore.getState();
    // Move 10 spaces (35 + 10 = 45, wraps to 5)
    await movePawnProgressive('0', 10);

    const state = useGameStore.getState();
    // Should receive Go reward only once
    expect(state.players[0].money).toBe(initialMoney + GO_REWARD);
  });

  it('should transition to acting phase after movement with Go passage', async () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    // Place player at tile 38
    useGameStore.setState({
      players: useGameStore.getState().players.map((p) =>
        p.id === '0' ? { ...p, tileIndex: 38 } : p
      ),
    });

    const { movePawnProgressive } = useGameStore.getState();
    await movePawnProgressive('0', 5);

    const state = useGameStore.getState();
    expect(state.turnPhase).toBe('acting');
  });

  it('should handle standard Go passage: tile 38 + 5 moves', async () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    const startMoney = 1500;
    useGameStore.setState({
      players: useGameStore.getState().players.map((p) =>
        p.id === '0' ? { ...p, tileIndex: 38, money: startMoney } : p
      ),
    });

    const { movePawnProgressive } = useGameStore.getState();
    await movePawnProgressive('0', 5);

    const state = useGameStore.getState();
    expect(state.players[0].tileIndex).toBe(3);
    expect(state.players[0].money).toBe(startMoney + GO_REWARD);
  });
});
