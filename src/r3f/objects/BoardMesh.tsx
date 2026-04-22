import { boardDefinition } from '../../game/board/boardDefinition';
import { getTileSide } from '../../game/board/getTileSide';
import { getPawnOffsets } from '../../game/board/getPawnOffsets';
import { useGameStore } from '../../game/store/gameStore';
import Tile from './Tile';
import PlayerPawn from './PlayerPawn';

interface BoardMeshProps {
  showAllLabels?: boolean;
}

export default function BoardMesh({ showAllLabels }: BoardMeshProps) {
  const players = useGameStore((state) => state.players);

  // Group players by tile index to calculate correct offsets
  const playersByTile: Record<number, typeof players> = {};
  players.forEach((player) => {
    const tileIndex = player.tileIndex ?? 0;
    if (!playersByTile[tileIndex]) {
      playersByTile[tileIndex] = [];
    }
    playersByTile[tileIndex].push(player);
  });

  return (
    <group>
      {boardDefinition.tiles.map((tile) => {
        const side = getTileSide(tile.index);

        return (
          <Tile
            key={tile.index}
            tile={tile}
            side={side}
            isCorner={side === 'corner'}
            showAllLabels={showAllLabels}
          />
        );
      })}

      {/* Render player pawns */}
      {Object.entries(playersByTile).map(([tileIndexStr, tilePlayers]) => {
        const tileIndex = parseInt(tileIndexStr, 10);
        const tile = boardDefinition.tiles[tileIndex];
        if (!tile) return null;

        const offsets = getPawnOffsets(tilePlayers.length);

        return tilePlayers.map((player, playerIndexInTile) => (
          <PlayerPawn
            key={player.id}
            position={[tile.position[0], 0, tile.position[2]]}
            color={player.color}
            offset={offsets[playerIndexInTile]}
          />
        ));
      })}

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
    </group>
  );
}
