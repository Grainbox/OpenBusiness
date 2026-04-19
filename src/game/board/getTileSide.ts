export type TileSide = 'bottom' | 'left' | 'top' | 'right' | 'corner';

export function getTileSide(index: number, size = 11): TileSide {
  const bottomEnd = size - 1;
  const leftEnd = bottomEnd + (size - 1);
  const topEnd = leftEnd + (size - 1);

  if (index === 0 || index === bottomEnd || index === leftEnd || index === topEnd) {
    return 'corner';
  }

  if (index > 0 && index < bottomEnd) {
    return 'bottom';
  }

  if (index > bottomEnd && index < leftEnd) {
    return 'left';
  }

  if (index > leftEnd && index < topEnd) {
    return 'top';
  }

  return 'right';
}
