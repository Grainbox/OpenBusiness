import { create } from 'zustand';
import type { GamePhase, Player } from '../types';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
}

export const useGameStore = create<GameState>(() => ({
  phase: 'playing',
  players: [
    { id: '1', name: 'Joueur 1', color: '#ef4444', tileIndex: 0, money: 1500 },
    { id: '2', name: 'Joueur 2', color: '#3b82f6', tileIndex: 0, money: 1500 },
    { id: '3', name: 'Joueur 3', color: '#10b981', tileIndex: 0, money: 1500 },
    { id: '4', name: 'Joueur 4', color: '#f59e0b', tileIndex: 0, money: 1500 },
  ],
  currentPlayerIndex: 0,
}));
