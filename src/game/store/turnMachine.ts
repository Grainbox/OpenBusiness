import type { TurnPhase } from '../types';

const VALID_TRANSITIONS: Record<TurnPhase, TurnPhase[]> = {
  idle: ['rolling'],
  rolling: ['moving'],
  moving: ['acting'],
  acting: ['end-turn'],
  'end-turn': ['idle'],
  'game-over': [],
};

export function isValidTransition(
  from: TurnPhase,
  to: TurnPhase
): boolean {
  const allowedTransitions = VALID_TRANSITIONS[from] ?? [];
  return allowedTransitions.includes(to);
}

export function canTransitionTo(
  currentPhase: TurnPhase,
  targetPhase: TurnPhase
): boolean {
  return isValidTransition(currentPhase, targetPhase);
}

export function logInvalidTransition(
  from: TurnPhase,
  to: TurnPhase
): void {
  if (import.meta.env.DEV) {
    console.warn(
      `[TurnMachine] Invalid transition: ${from} → ${to}. Allowed: ${VALID_TRANSITIONS[from]?.join(', ')}`
    );
  }
}
