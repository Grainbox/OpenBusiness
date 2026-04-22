import { Html } from '@react-three/drei';
import type { TileDefinition } from '../../game/types/board';
import type { TileSide } from '../../game/board/getTileSide';
import './tile-label.css';

interface TileLabelProps {
  tile: TileDefinition;
  showPrice: boolean;
  emphasized?: boolean;
  side?: TileSide;
}

export default function TileLabel({ tile, showPrice, emphasized, side }: TileLabelProps) {
  // Apply scaleX: -1 for sides where text would be backwards
  const needsFlip = side === 'top' || side === 'right';
  const style = needsFlip ? { transform: 'scaleX(-1)' } : undefined;

  return (
    <Html center transform className="tile-label" zIndexRange={[1, 0]} style={style}>
      <div className={`tile-label__card${emphasized ? ' tile-label__card--hover' : ''}`}>
        <div className="tile-label__name">{tile.name}</div>
        {showPrice && typeof tile.price === 'number' && (
          <div className="tile-label__price">{tile.price}</div>
        )}
      </div>
    </Html>
  );
}
