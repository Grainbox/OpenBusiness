import { useMemo, useState } from 'react';
import type { GroupProps } from '@react-three/fiber';
import type { TileDefinition } from '../../game/types/board';
import type { TileSide } from '../../game/board/getTileSide';
import { PROPERTY_GROUP_COLORS, isPropertyGroup } from '../../game/board/propertyGroups';
import { TILE_TYPE_COLORS } from '../theme/tileTheme';
import TileLabel from '../overlay/TileLabel';

interface TileProps extends GroupProps {
  tile: TileDefinition;
  isCorner?: boolean;
  side: TileSide;
  showAllLabels?: boolean;
  onClick?: () => void;
}

const TILE_SIZE = 1.1;
const TILE_HEIGHT = 0.2;
const CORNER_HEIGHT = 0.3;
const BAND_HEIGHT = 0.05;
const BAND_DEPTH = 0.18;
const HOVER_COLOR = '#fef3c7';

export default function Tile({
  tile,
  isCorner,
  side,
  showAllLabels,
  onClick,
  ...groupProps
}: TileProps) {
  const [hovered, setHovered] = useState(false);
  const height = isCorner ? CORNER_HEIGHT : TILE_HEIGHT;
  const baseColor = TILE_TYPE_COLORS[tile.type] ?? '#e5e7eb';
  const bandColor = isPropertyGroup(tile.group)
    ? PROPERTY_GROUP_COLORS[tile.group]
    : PROPERTY_GROUP_COLORS.none;
  const showLabel = showAllLabels || tile.type === 'property';
  const showPrice = tile.type === 'property';
  const rotationY =
    side === 'left'
      ? Math.PI / 2
      : side === 'top'
        ? Math.PI
        : side === 'right'
          ? -Math.PI / 2
          : 0;
  const labelOffset = useMemo(() => height + 0.08, [height]);

  return (
    <group
      {...groupProps}
      position={[tile.position[0], 0, tile.position[2]]}
      rotation={[0, rotationY, 0]}
    >
      {showLabel && (
        <group position={[0, labelOffset, 0]}>
          <TileLabel tile={tile} showPrice={showPrice} emphasized={hovered} />
        </group>
      )}

      <mesh
        position={[0, height / 2, 0]}
        castShadow
        receiveShadow
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[TILE_SIZE, height, TILE_SIZE]} />
        <meshStandardMaterial color={hovered ? HOVER_COLOR : baseColor} />
      </mesh>

      {tile.type === 'property' && (
        <mesh position={[0, height + BAND_HEIGHT / 2, TILE_SIZE / 2 - BAND_DEPTH / 2]}>
          <boxGeometry args={[TILE_SIZE, BAND_HEIGHT, BAND_DEPTH]} />
          <meshStandardMaterial color={bandColor} />
        </mesh>
      )}
    </group>
  );
}
