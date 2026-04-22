const PAWN_SIZE = 0.3;
const OFFSET_DISTANCE = 0.8;

export type PawnOffset = [number, number];

/**
 * Generate deterministic offsets for N players on the same tile.
 * Returns array of [x, z] offsets to position pawns without overlap.
 */
export function getPawnOffsets(playerCount: number): PawnOffset[] {
  const count = Math.max(1, Math.min(playerCount, 6));

  const offsets: Record<number, PawnOffset[]> = {
    1: [[0, 0]],
    2: [[-OFFSET_DISTANCE / 2, 0], [OFFSET_DISTANCE / 2, 0]],
    3: [
      [-OFFSET_DISTANCE / 2, -OFFSET_DISTANCE / 3],
      [OFFSET_DISTANCE / 2, -OFFSET_DISTANCE / 3],
      [0, OFFSET_DISTANCE / 2],
    ],
    4: [
      [-OFFSET_DISTANCE / 2, -OFFSET_DISTANCE / 3],
      [OFFSET_DISTANCE / 2, -OFFSET_DISTANCE / 3],
      [-OFFSET_DISTANCE / 2, OFFSET_DISTANCE / 3],
      [OFFSET_DISTANCE / 2, OFFSET_DISTANCE / 3],
    ],
    5: [
      [-OFFSET_DISTANCE / 2, -OFFSET_DISTANCE / 2],
      [OFFSET_DISTANCE / 2, -OFFSET_DISTANCE / 2],
      [-OFFSET_DISTANCE / 2, OFFSET_DISTANCE / 2],
      [OFFSET_DISTANCE / 2, OFFSET_DISTANCE / 2],
      [0, 0],
    ],
    6: [
      [-OFFSET_DISTANCE / 2, -OFFSET_DISTANCE / 2],
      [0, -OFFSET_DISTANCE / 2],
      [OFFSET_DISTANCE / 2, -OFFSET_DISTANCE / 2],
      [-OFFSET_DISTANCE / 2, OFFSET_DISTANCE / 2],
      [0, OFFSET_DISTANCE / 2],
      [OFFSET_DISTANCE / 2, OFFSET_DISTANCE / 2],
    ],
  };

  return offsets[count] || offsets[1];
}

/**
 * Calculate distance between two points to detect overlap.
 */
function getDistance(p1: PawnOffset, p2: PawnOffset): number {
  const dx = p1[0] - p2[0];
  const dz = p1[1] - p2[1];
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Check if offsets have acceptable spacing (no major overlap).
 */
export function validatePawnOffsets(offsets: PawnOffset[]): boolean {
  const minDistance = PAWN_SIZE * 0.6;
  for (let i = 0; i < offsets.length; i++) {
    for (let j = i + 1; j < offsets.length; j++) {
      if (getDistance(offsets[i], offsets[j]) < minDistance) {
        return false;
      }
    }
  }
  return true;
}
