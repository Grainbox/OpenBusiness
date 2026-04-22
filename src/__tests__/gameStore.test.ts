import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game/store/gameStore';

describe('Game Store', () => {
  beforeEach(() => {
    useGameStore.setState({
      gamePhase: 'playing',
      turnPhase: 'idle',
      players: [],
      currentPlayerIndex: 0,
      dice: null,
      properties: {},
      turnCount: 0,
    });
  });

  it('should initialize game with 2 players', () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    const state = useGameStore.getState();
    expect(state.players).toHaveLength(2);
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.turnPhase).toBe('idle');
    expect(state.dice).toBeNull();
    expect(state.turnCount).toBe(0);
    expect(state.properties).toEqual({});

    state.players.forEach((player) => {
      expect(player.tileIndex).toBe(0);
      expect(player.money).toBe(1500);
      expect(player.color).toBeDefined();
      expect(player.bankrupt).toBe(false);
      expect(player.inJail).toBe(false);
      expect(player.doubleCount).toBe(0);
    });
  });

  it('should initialize game with 4 players', () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2', 'Joueur 3', 'Joueur 4']);

    const state = useGameStore.getState();
    expect(state.players).toHaveLength(4);
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.turnPhase).toBe('idle');
    expect(state.dice).toBeNull();
    expect(state.turnCount).toBe(0);
    expect(state.properties).toEqual({});

    state.players.forEach((player) => {
      expect(player.tileIndex).toBe(0);
      expect(player.money).toBe(1500);
      expect(player.color).toBeDefined();
      expect(player.bankrupt).toBe(false);
      expect(player.inJail).toBe(false);
      expect(player.doubleCount).toBe(0);
    });
  });

  it('should initialize game with 6 players', () => {
    const { initGame } = useGameStore.getState();
    initGame([
      'Joueur 1',
      'Joueur 2',
      'Joueur 3',
      'Joueur 4',
      'Joueur 5',
      'Joueur 6',
    ]);

    const state = useGameStore.getState();
    expect(state.players).toHaveLength(6);
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.turnPhase).toBe('idle');
    expect(state.dice).toBeNull();
    expect(state.turnCount).toBe(0);
    expect(state.properties).toEqual({});

    state.players.forEach((player) => {
      expect(player.tileIndex).toBe(0);
      expect(player.money).toBe(1500);
      expect(player.color).toBeDefined();
      expect(player.bankrupt).toBe(false);
      expect(player.inJail).toBe(false);
      expect(player.doubleCount).toBe(0);
    });
  });

  it('should assign unique colors to players up to 6', () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2', 'Joueur 3', 'Joueur 4', 'Joueur 5', 'Joueur 6']);

    const state = useGameStore.getState();
    const colors = state.players.map((p) => p.color);
    const uniqueColors = new Set(colors);

    expect(uniqueColors.size).toBe(6);
  });

  it('should transition through valid turn phases', () => {
    const { initGame, setTurnPhase } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    expect(useGameStore.getState().turnPhase).toBe('idle');

    setTurnPhase('rolling');
    expect(useGameStore.getState().turnPhase).toBe('rolling');

    setTurnPhase('moving');
    expect(useGameStore.getState().turnPhase).toBe('moving');

    setTurnPhase('acting');
    expect(useGameStore.getState().turnPhase).toBe('acting');

    setTurnPhase('end-turn');
    expect(useGameStore.getState().turnPhase).toBe('end-turn');

    setTurnPhase('idle');
    expect(useGameStore.getState().turnPhase).toBe('idle');
  });

  it('should reject invalid turn phase transitions', () => {
    const { initGame, setTurnPhase } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    expect(useGameStore.getState().turnPhase).toBe('idle');

    // Try to move directly from idle to moving (skip rolling)
    setTurnPhase('moving');
    expect(useGameStore.getState().turnPhase).toBe('idle');

    // Try to go backward
    setTurnPhase('rolling');
    expect(useGameStore.getState().turnPhase).toBe('rolling');
    setTurnPhase('idle');
    expect(useGameStore.getState().turnPhase).toBe('rolling');

    // Try invalid transition from rolling to acting (skip moving)
    setTurnPhase('acting');
    expect(useGameStore.getState().turnPhase).toBe('rolling');
  });

  it('should update turn phase', () => {
    const { initGame, setTurnPhase } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    setTurnPhase('rolling');
    expect(useGameStore.getState().turnPhase).toBe('rolling');

    setTurnPhase('moving');
    expect(useGameStore.getState().turnPhase).toBe('moving');
  });

  it('should update player money', () => {
    const { initGame, updatePlayerMoney } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    const playerId = '0';
    updatePlayerMoney(playerId, 200);
    expect(useGameStore.getState().players[0].money).toBe(1700);

    updatePlayerMoney(playerId, -300);
    expect(useGameStore.getState().players[0].money).toBe(1400);
  });

  it('should move player to tile', () => {
    const { initGame, movePlayerTile } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    movePlayerTile('0', 5);
    expect(useGameStore.getState().players[0].tileIndex).toBe(5);
  });

  it('should end turn and pass to next player', () => {
    const { initGame, endTurn, setTurnPhase } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2', 'Joueur 3']);

    setTurnPhase('rolling');
    expect(useGameStore.getState().currentPlayerIndex).toBe(0);

    endTurn();
    expect(useGameStore.getState().currentPlayerIndex).toBe(1);
    expect(useGameStore.getState().turnPhase).toBe('idle');
    expect(useGameStore.getState().dice).toBeNull();

    endTurn();
    expect(useGameStore.getState().currentPlayerIndex).toBe(2);

    endTurn();
    expect(useGameStore.getState().currentPlayerIndex).toBe(0);
  });

  it('should increment turnCount when returning to player 0', () => {
    const { initGame, endTurn } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    expect(useGameStore.getState().turnCount).toBe(0);

    endTurn(); // 0 → 1
    expect(useGameStore.getState().turnCount).toBe(0);

    endTurn(); // 1 → 0
    expect(useGameStore.getState().turnCount).toBe(1);

    endTurn(); // 0 → 1
    expect(useGameStore.getState().turnCount).toBe(1);

    endTurn(); // 1 → 0
    expect(useGameStore.getState().turnCount).toBe(2);
  });

  it('should skip bankrupt players in turn order', () => {
    const { initGame, setBankrupt, endTurn } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2', 'Joueur 3', 'Joueur 4']);

    setBankrupt('1', true);
    expect(useGameStore.getState().currentPlayerIndex).toBe(0);

    endTurn();
    expect(useGameStore.getState().currentPlayerIndex).toBe(2);

    endTurn();
    expect(useGameStore.getState().currentPlayerIndex).toBe(3);

    endTurn();
    expect(useGameStore.getState().currentPlayerIndex).toBe(0);
  });

  it('should skip multiple consecutive bankrupt players', () => {
    const { initGame, setBankrupt, endTurn } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2', 'Joueur 3', 'Joueur 4']);

    setBankrupt('1', true);
    setBankrupt('2', true);
    expect(useGameStore.getState().currentPlayerIndex).toBe(0);

    endTurn();
    expect(useGameStore.getState().currentPlayerIndex).toBe(3);
  });

  it('should reset doubleCount when passing turn', () => {
    const { initGame, endTurn, incrementDoubleCount } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    incrementDoubleCount('0');
    incrementDoubleCount('0');
    expect(useGameStore.getState().players[0].doubleCount).toBe(2);

    endTurn();
    expect(useGameStore.getState().players[1].doubleCount).toBe(0);
  });

  it('should set game over when only one player remains solvent', () => {
    const { initGame, setBankrupt, endTurn } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    setBankrupt('1', true);
    endTurn();
    expect(useGameStore.getState().turnPhase).toBe('game-over');
  });

  it('should reset dice and set turnPhase to idle on endTurn', () => {
    const { initGame, setDice, setTurnPhase, endTurn } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    setDice([4, 5]);
    setTurnPhase('acting');

    expect(useGameStore.getState().dice).toEqual([4, 5]);
    endTurn();
    expect(useGameStore.getState().dice).toBeNull();
    expect(useGameStore.getState().turnPhase).toBe('idle');
  });

  it('should roll dice from idle phase', () => {
    const { initGame, rollDice } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    expect(useGameStore.getState().turnPhase).toBe('idle');
    rollDice();

    const state = useGameStore.getState();
    expect(state.dice).not.toBeNull();
    expect(state.dice![0]).toBeGreaterThanOrEqual(1);
    expect(state.dice![0]).toBeLessThanOrEqual(6);
    expect(state.dice![1]).toBeGreaterThanOrEqual(1);
    expect(state.dice![1]).toBeLessThanOrEqual(6);
    expect(state.turnPhase).toBe('moving');
  });

  it('should not roll dice from non-idle phase', () => {
    const { initGame, setTurnPhase, rollDice } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    setTurnPhase('rolling');
    const diceBeforeAttempt = useGameStore.getState().dice;

    rollDice();

    expect(useGameStore.getState().dice).toBe(diceBeforeAttempt);
    expect(useGameStore.getState().turnPhase).toBe('rolling');
  });

  it('should detect double and set hasDouble flag', () => {
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
        expect(state.players[0].hasDouble).toBe(true);
        expect(state.players[0].consecutiveDoubles).toBe(1);
        break;
      }
    }
  });

  it('should send player to jail on three consecutive doubles', () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    const currentPlayer = useGameStore.getState().players[0];
    useGameStore.setState({
      players: useGameStore.getState().players.map((p) =>
        p.id === currentPlayer.id ? { ...p, consecutiveDoubles: 2 } : p
      ),
    });

    let tripleDoubleFound = false;
    for (let i = 0; i < 1000; i++) {
      useGameStore.setState({ turnPhase: 'idle', dice: null });
      const currentState = useGameStore.getState();
      const prevConsecutiveDoubles = currentState.players[0].consecutiveDoubles;

      const { rollDice: roll } = currentState;
      roll();

      const state = useGameStore.getState();
      const [die1, die2] = state.dice!;

      if (die1 === die2 && prevConsecutiveDoubles === 2) {
        tripleDoubleFound = true;
        expect(state.players[0].inJail).toBe(true);
        expect(state.players[0].tileIndex).toBe(10);
        expect(state.players[0].consecutiveDoubles).toBe(0);
        expect(state.turnPhase).toBe('acting');
        break;
      }

      if (die1 !== die2) {
        // Reset to consecutiveDoubles 2 for next iteration
        useGameStore.setState({
          players: state.players.map((p) =>
            p.id === currentPlayer.id ? { ...p, consecutiveDoubles: 2 } : p
          ),
        });
      }
    }

    expect(tripleDoubleFound).toBe(true);
  });

  it('should reset consecutive doubles when rolling non-double', () => {
    const { initGame } = useGameStore.getState();
    initGame(['Joueur 1', 'Joueur 2']);

    const currentPlayer = useGameStore.getState().players[0];
    useGameStore.setState({
      players: useGameStore.getState().players.map((p) =>
        p.id === currentPlayer.id ? { ...p, consecutiveDoubles: 2 } : p
      ),
    });

    let nonDoubleFound = false;
    for (let i = 0; i < 1000; i++) {
      useGameStore.setState({ turnPhase: 'idle', dice: null });
      const { rollDice: roll } = useGameStore.getState();
      roll();

      const state = useGameStore.getState();
      const [die1, die2] = state.dice!;

      if (die1 !== die2) {
        nonDoubleFound = true;
        expect(state.players[0].consecutiveDoubles).toBe(0);
        expect(state.players[0].inJail).toBe(false);
        expect(state.turnPhase).toBe('moving');
        break;
      }

      // If double was rolled, keep consecutiveDoubles at 2 for next iteration
      if (die1 === die2) {
        useGameStore.setState({
          players: state.players.map((p) =>
            p.id === currentPlayer.id ? { ...p, consecutiveDoubles: 2 } : p
          ),
        });
      }
    }

    expect(nonDoubleFound).toBe(true);
  });
});
