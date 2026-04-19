export function generateBoardPath(
  size = 11,
  tileSize = 1.2
): [number, number, number][] {
  if (size < 2) {
    throw new Error('Board size must be at least 2.');
  }

  const positions: [number, number, number][] = [];
  const half = (size - 1) / 2;
  const toWorld = (coord: number) => (coord - half) * tileSize;

  const min = 0;
  const max = size - 1;

  // Bottom row: right -> left
  for (let x = max; x >= min; x -= 1) {
    positions.push([toWorld(x), 0, toWorld(max)]);
  }

  // Left column: bottom -> top (skip bottom corner)
  for (let z = max - 1; z >= min; z -= 1) {
    positions.push([toWorld(min), 0, toWorld(z)]);
  }

  // Top row: left -> right (skip left corner)
  for (let x = min + 1; x <= max; x += 1) {
    positions.push([toWorld(x), 0, toWorld(min)]);
  }

  // Right column: top -> bottom (skip top and bottom corners)
  for (let z = min + 1; z <= max - 1; z += 1) {
    positions.push([toWorld(max), 0, toWorld(z)]);
  }

  return positions;
}
