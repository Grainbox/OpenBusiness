import { create } from 'zustand';
import type { GamePhase, TurnPhase, Player, PropertyState } from '../types';
import { isValidTransition, logInvalidTransition } from './turnMachine';
import { rollDice as rollDiceLogic, isDouble } from '../logic/dice';
import { movePawnProgressive } from '../logic/movePawn';
import { GO_REWARD } from '../logic/goReward';

export interface GameStateActions {
  initGame: (playerNames: string[]) => void;
  setTurnPhase: (phase: TurnPhase) => void;
  setDice: (dice: [number, number] | null) => void;
  setCurrentPlayerIndex: (index: number) => void;
  movePlayerTile: (playerId: string, tileIndex: number) => void;
  movePawnProgressive: (playerId: string, spacesToMove: number) => Promise<void>;
  updatePlayerMoney: (playerId: string, amount: number) => void;
  setPlayerProperty: (tileIndex: number, ownerId: string | undefined) => void;
  setBankrupt: (playerId: string, bankrupt: boolean) => void;
  setInJail: (playerId: string, inJail: boolean) => void;
  incrementDoubleCount: (playerId: string) => void;
  resetDoubleCount: (playerId: string) => void;
  rollDice: () => void;
  resetDiceRoll: () => void;
  endTurn: () => void;
}

export interface GameState extends GameStateActions {
  gamePhase: GamePhase;
  turnPhase: TurnPhase;
  players: Player[];
  currentPlayerIndex: number;
  dice: [number, number] | null;
  hasDouble: boolean;
  properties: Record<number, PropertyState>;
  turnCount: number;
}

export const useGameStore = create<GameState>((set) => ({
  gamePhase: 'playing',
  turnPhase: 'idle',
  players: [],
  currentPlayerIndex: 0,
  dice: null,
  hasDouble: false,
  properties: {},
  turnCount: 0,

  initGame: (playerNames: string[]) => {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const players: Player[] = playerNames.map((name, index) => ({
      id: String(index),
      name,
      color: colors[index % colors.length],
      tileIndex: 0,
      money: 1500,
      bankrupt: false,
      inJail: false,
      doubleCount: 0,
      hasDouble: false,
      consecutiveDoubles: 0,
    }));

    set({
      players,
      currentPlayerIndex: 0,
      turnPhase: 'idle',
      turnCount: 0,
      dice: null,
      hasDouble: false,
      properties: {},
    });
  },

  setTurnPhase: (phase: TurnPhase) => {
    set((state) => {
      if (!isValidTransition(state.turnPhase, phase)) {
        logInvalidTransition(state.turnPhase, phase);
        return state;
      }
      return { turnPhase: phase };
    });
  },

  setDice: (dice: [number, number] | null) => {
    set({ dice });
  },

  setCurrentPlayerIndex: (index: number) => {
    set({ currentPlayerIndex: index });
  },

  movePlayerTile: (playerId: string, tileIndex: number) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, tileIndex } : p
      ),
    }));
  },

  movePawnProgressive: async (playerId: string, spacesToMove: number) => {
    const state = useGameStore.getState();
    const player = state.players.find((p) => p.id === playerId);

    if (!player) {
      return;
    }

    await movePawnProgressive(
      player.tileIndex,
      spacesToMove,
      {
        onStepMove: (tileIndex: number) => {
          set((state) => ({
            players: state.players.map((p) =>
              p.id === playerId ? { ...p, tileIndex } : p
            ),
          }));
        },
        onPassedGo: () => {
          // Apply Go reward
          set((state) => ({
            players: state.players.map((p) =>
              p.id === playerId
                ? { ...p, money: p.money + GO_REWARD }
                : p
            ),
          }));
        },
      }
    );

    set({
      turnPhase: 'acting',
    });
  },

  updatePlayerMoney: (playerId: string, amount: number) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, money: p.money + amount } : p
      ),
    }));
  },

  setPlayerProperty: (tileIndex: number, ownerId: string | undefined) => {
    set((state) => ({
      properties: {
        ...state.properties,
        [tileIndex]: { ...state.properties[tileIndex], ownerId },
      },
    }));
  },

  setBankrupt: (playerId: string, bankrupt: boolean) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, bankrupt } : p
      ),
    }));
  },

  setInJail: (playerId: string, inJail: boolean) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, inJail } : p
      ),
    }));
  },

  incrementDoubleCount: (playerId: string) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId
          ? { ...p, doubleCount: (p.doubleCount ?? 0) + 1 }
          : p
      ),
    }));
  },

  resetDoubleCount: (playerId: string) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, doubleCount: 0 } : p
      ),
    }));
  },

  rollDice: () => {
    set((state) => {
      const currentPhase = state.turnPhase;
      if (!isValidTransition(currentPhase, 'rolling')) {
        logInvalidTransition(currentPhase, 'rolling');
        return state;
      }

      const dice = rollDiceLogic();
      const double = isDouble(dice);
      const currentPlayer = state.players[state.currentPlayerIndex];

      if (!currentPlayer) {
        return state;
      }

      const newConsecutiveDoubles = double
        ? (currentPlayer.consecutiveDoubles ?? 0) + 1
        : 0;

      if (newConsecutiveDoubles >= 3) {
        return {
          ...state,
          dice,
          hasDouble: false,
          turnPhase: 'acting',
          players: state.players.map((p) =>
            p.id === currentPlayer.id
              ? {
                  ...p,
                  inJail: true,
                  tileIndex: 10,
                  hasDouble: double,
                  consecutiveDoubles: 0,
                }
              : p
          ),
        };
      }

      return {
        ...state,
        dice,
        hasDouble: double,
        turnPhase: 'moving',
        players: state.players.map((p) =>
          p.id === currentPlayer.id
            ? {
                ...p,
                hasDouble: double,
                consecutiveDoubles: newConsecutiveDoubles,
              }
            : p
        ),
      };
    });
  },

  resetDiceRoll: () => {
    set((state) => {
      if (state.turnPhase === 'idle') {
        return state;
      }

      return {
        dice: null,
        hasDouble: false,
        turnPhase: 'idle',
      };
    });
  },

  endTurn: () => {
    set((state) => {
      const activePlayers = state.players.filter((p) => !p.bankrupt);

      if (activePlayers.length <= 1) {
        return { turnPhase: 'game-over' };
      }

      let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      while (
        state.players[nextIndex]?.bankrupt &&
        nextIndex !== state.currentPlayerIndex
      ) {
        nextIndex = (nextIndex + 1) % state.players.length;
      }

      const nextPlayer = state.players[nextIndex];
      const updatedPlayers = state.players.map((p) =>
        p.id === nextPlayer?.id
          ? { ...p, doubleCount: 0, hasDouble: false }
          : p
      );

      return {
        currentPlayerIndex: nextIndex,
        turnPhase: 'idle',
        dice: null,
        hasDouble: false,
        turnCount: nextIndex === 0 ? state.turnCount + 1 : state.turnCount,
        players: updatedPlayers,
      };
    });
  },
}));
