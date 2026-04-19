import { create } from 'zustand';
import type { GamePhase, Player } from '../types';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
}

export const useGameStore = create<GameState>(() => ({
  phase: 'menu',
  players: [],
  currentPlayerIndex: 0,
}));
