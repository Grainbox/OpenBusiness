import type { TileType } from '../../game/types/board';

export const TILE_TYPE_COLORS: Record<TileType, string> = {
  go: '#e2e8f0',
  property: '#f8fafc',
  tax: '#fecdd3',
  chance: '#fde68a',
  community: '#bae6fd',
  jail: '#d1d5db',
  'free-parking': '#e5e7eb',
  'go-to-jail': '#fecaca',
  utility: '#ccfbf1',
  railroad: '#e5e7eb',
};
