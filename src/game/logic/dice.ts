export function rollDice(): [number, number] {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return [die1, die2];
}

export function isDouble(dice: [number, number]): boolean {
  return dice[0] === dice[1];
}

export function getTotalValue(dice: [number, number]): number {
  return dice[0] + dice[1];
}
