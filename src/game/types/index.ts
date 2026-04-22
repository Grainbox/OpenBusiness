export interface Player {
  id: string;
  name: string;
  color: string;
  tileIndex: number;
  money: number;
}

export type GamePhase = 'menu' | 'lobby' | 'playing' | 'ended';

export * from './board';
