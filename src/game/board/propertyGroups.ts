import type { TileGroup } from '../types/board';

export const PROPERTY_GROUPS: TileGroup[] = [
  'brown',
  'lightBlue',
  'pink',
  'orange',
  'red',
  'yellow',
  'green',
  'blue',
  'railroad',
  'utility',
];

export const PROPERTY_GROUP_COLORS: Record<TileGroup, string> = {
  brown: '#8b5a2b',
  lightBlue: '#6ec6ff',
  pink: '#ff6fae',
  orange: '#ff9f43',
  red: '#ff4d4f',
  yellow: '#ffd666',
  green: '#52c41a',
  blue: '#2f54eb',
  railroad: '#6b7280',
  utility: '#14b8a6',
  none: '#e5e7eb',
};

export function isPropertyGroup(group?: TileGroup): group is TileGroup {
  return Boolean(group && group !== 'none');
}
