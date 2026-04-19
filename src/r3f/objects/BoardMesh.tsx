import { boardDefinition } from '../../game/board/boardDefinition';
import { getTileSide } from '../../game/board/getTileSide';
import Tile from './Tile';

interface BoardMeshProps {
  showAllLabels?: boolean;
}

export default function BoardMesh({ showAllLabels }: BoardMeshProps) {
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

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
    </group>
  );
}
