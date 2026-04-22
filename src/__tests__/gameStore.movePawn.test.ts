import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store/gameStore';

describe('Game Store - Move Pawn Progressive', () => {
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

  it('should move player progressively and transition to acting phase', async () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    const { movePawnProgressive } = useGameStore.getState();
    await movePawnProgressive('0', 5);

    const state = useGameStore.getState();
    expect(state.players[0].tileIndex).toBe(5);
    expect(state.turnPhase).toBe('acting');
  });

  it('should update tileIndex at each intermediate step', async () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    const { movePawnProgressive } = useGameStore.getState();

    // Start movement without awaiting to observe intermediate states
    const movementPromise = movePawnProgressive('0', 3);

    // Give time for first movement
    await new Promise((resolve) => setTimeout(resolve, 300));
    let state = useGameStore.getState();
    expect(state.players[0].tileIndex).toBe(1);

    // Wait for completion
    await movementPromise;
    state = useGameStore.getState();
    expect(state.players[0].tileIndex).toBe(3);
  });

  it('should wrap around board correctly', async () => {
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
    expect(state.players[0].tileIndex).toBe(3);
  });

  it('should not move if player does not exist', async () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    const { movePawnProgressive } = useGameStore.getState();
    const initialTile = useGameStore.getState().players[0].tileIndex;

    // Try to move non-existent player
    await movePawnProgressive('999', 5);

    const state = useGameStore.getState();
    expect(state.players[0].tileIndex).toBe(initialTile);
  });
});
