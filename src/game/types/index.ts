export interface Player {
  id: string;
  name: string;
  color: string;
  tileIndex: number;
  money: number;
  bankrupt?: boolean;
  inJail?: boolean;
  doubleCount?: number;
}

export type GamePhase = 'menu' | 'lobby' | 'playing' | 'ended';

export type TurnPhase =
  | 'idle'
  | 'rolling'
  | 'moving'
  | 'acting'
  | 'end-turn'
  | 'game-over';

export interface PropertyState {
  ownerId?: string;
  mortgaged?: boolean;
  houses?: number;
  hotels?: number;
}

export * from './board';
