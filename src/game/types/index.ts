export interface Player {
  id: string;
  name: string;
}

export type GamePhase = 'menu' | 'lobby' | 'playing' | 'ended';

export * from './board';
