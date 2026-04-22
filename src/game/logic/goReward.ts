export const GO_REWARD = 200;

export interface GoPassageDetected {
  passageOccurred: boolean;
  tilesCrossed: number[];
}

export function detectGoPassage(
  startTileIndex: number,
  spacesToMove: number
): GoPassageDetected {
  const BOARD_SIZE = 40;
  const tilesCrossed: number[] = [];
  let passageOccurred = false;

  for (let i = 1; i <= spacesToMove; i++) {
    const currentTile = (startTileIndex + i) % BOARD_SIZE;
    tilesCrossed.push(currentTile);

    // Detect crossing Go: when we wrap around from high index to low index
    // This happens when (startTileIndex + i) >= 40
    if (startTileIndex + i >= BOARD_SIZE) {
      passageOccurred = true;
    }
  }

  return { passageOccurred, tilesCrossed };
}
