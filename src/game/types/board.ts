export type TileType =
  | 'go'
  | 'property'
  | 'tax'
  | 'chance'
  | 'community'
  | 'jail'
  | 'free-parking'
  | 'go-to-jail'
  | 'utility'
  | 'railroad';

export type TileGroup =
  | 'brown'
  | 'lightBlue'
  | 'pink'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'railroad'
  | 'utility'
  | 'none';

export interface TileDefinition {
  index: number;
  name: string;
  type: TileType;
  price?: number;
  rent?: number;
  group?: TileGroup;
  position: [number, number, number];
}

export interface BoardDefinition {
  tiles: TileDefinition[];
}
