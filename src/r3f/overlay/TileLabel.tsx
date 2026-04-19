import { Html } from '@react-three/drei';
import type { TileDefinition } from '../../game/types/board';
import './tile-label.css';

interface TileLabelProps {
  tile: TileDefinition;
  showPrice: boolean;
  emphasized?: boolean;
}

export default function TileLabel({ tile, showPrice, emphasized }: TileLabelProps) {
  return (
    <Html center transform className="tile-label" zIndexRange={[1, 0]}>
      <div className={`tile-label__card${emphasized ? ' tile-label__card--hover' : ''}`}>
        <div className="tile-label__name">{tile.name}</div>
        {showPrice && typeof tile.price === 'number' && (
          <div className="tile-label__price">{tile.price}</div>
        )}
      </div>
    </Html>
  );
}
