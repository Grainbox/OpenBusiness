const BOARD_SIZE = 40;
const MOVE_DELAY_MS = 250;

export interface MovePawnCallbacks {
  onStepMove: (tileIndex: number) => void;
  onPassedGo?: () => void;
}

export async function movePawnProgressive(
  startTileIndex: number,
  spacesToMove: number,
  callbacks: MovePawnCallbacks
): Promise<number> {
  let currentTile = startTileIndex;
  let passedGo = false;

  for (let i = 0; i < spacesToMove; i++) {
    await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY_MS));

    const nextTile = (currentTile + 1) % BOARD_SIZE;

    // Detect passing through Go (wrapping around)
    if (nextTile < currentTile) {
      passedGo = true;
    }

    callbacks.onStepMove(nextTile);
    currentTile = nextTile;
  }

  if (passedGo && callbacks.onPassedGo) {
    callbacks.onPassedGo();
  }

  return currentTile;
}
