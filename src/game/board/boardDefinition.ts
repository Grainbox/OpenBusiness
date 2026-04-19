import { generateBoardPath } from './generateBoardPath';
import type { BoardDefinition, TileDefinition, TileGroup, TileType } from '../types/board';

const tileMeta: Array<{
  name: string;
  type: TileType;
  price?: number;
  rent?: number;
  group?: TileGroup;
}> = [
  { name: 'Depart', type: 'go' },
  { name: 'Rue Alpha', type: 'property', price: 60, rent: 2, group: 'brown' },
  { name: 'Caisse Communaute', type: 'community' },
  { name: 'Rue Beta', type: 'property', price: 60, rent: 4, group: 'brown' },
  { name: 'Taxe Locale', type: 'tax' },
  { name: 'Gare Nord', type: 'railroad', price: 200, rent: 25, group: 'railroad' },
  { name: 'Rue Gamma', type: 'property', price: 100, rent: 6, group: 'lightBlue' },
  { name: 'Chance', type: 'chance' },
  { name: 'Rue Delta', type: 'property', price: 100, rent: 6, group: 'lightBlue' },
  { name: 'Rue Epsilon', type: 'property', price: 120, rent: 8, group: 'lightBlue' },
  { name: 'Prison / Visite', type: 'jail' },
  { name: 'Rue Zeta', type: 'property', price: 140, rent: 10, group: 'pink' },
  { name: 'Compagnie Electrique', type: 'utility', price: 150, rent: 10, group: 'utility' },
  { name: 'Rue Eta', type: 'property', price: 140, rent: 10, group: 'pink' },
  { name: 'Rue Theta', type: 'property', price: 160, rent: 12, group: 'pink' },
  { name: 'Gare Sud', type: 'railroad', price: 200, rent: 25, group: 'railroad' },
  { name: 'Rue Iota', type: 'property', price: 180, rent: 14, group: 'orange' },
  { name: 'Caisse Communaute', type: 'community' },
  { name: 'Rue Kappa', type: 'property', price: 180, rent: 14, group: 'orange' },
  { name: 'Rue Lambda', type: 'property', price: 200, rent: 16, group: 'orange' },
  { name: 'Parking Gratuit', type: 'free-parking' },
  { name: 'Rue Mu', type: 'property', price: 220, rent: 18, group: 'red' },
  { name: 'Chance', type: 'chance' },
  { name: 'Rue Nu', type: 'property', price: 220, rent: 18, group: 'red' },
  { name: 'Rue Xi', type: 'property', price: 240, rent: 20, group: 'red' },
  { name: 'Gare Ouest', type: 'railroad', price: 200, rent: 25, group: 'railroad' },
  { name: 'Rue Omicron', type: 'property', price: 260, rent: 22, group: 'yellow' },
  { name: 'Rue Pi', type: 'property', price: 260, rent: 22, group: 'yellow' },
  { name: 'Compagnie Eau', type: 'utility', price: 150, rent: 10, group: 'utility' },
  { name: 'Rue Rho', type: 'property', price: 280, rent: 24, group: 'yellow' },
  { name: 'Aller en Prison', type: 'go-to-jail' },
  { name: 'Rue Sigma', type: 'property', price: 300, rent: 26, group: 'green' },
  { name: 'Rue Tau', type: 'property', price: 300, rent: 26, group: 'green' },
  { name: 'Caisse Communaute', type: 'community' },
  { name: 'Rue Upsilon', type: 'property', price: 320, rent: 28, group: 'green' },
  { name: 'Gare Est', type: 'railroad', price: 200, rent: 25, group: 'railroad' },
  { name: 'Chance', type: 'chance' },
  { name: 'Rue Phi', type: 'property', price: 350, rent: 35, group: 'blue' },
  { name: 'Taxe Luxe', type: 'tax' },
  { name: 'Rue Omega', type: 'property', price: 400, rent: 50, group: 'blue' },
];

const positions = generateBoardPath();

const tiles: TileDefinition[] = positions.map((position, index) => {
  const meta = tileMeta[index];
  if (!meta) {
    throw new Error(`Missing tile meta at index ${index}.`);
  }

  return {
    index,
    position,
    name: meta.name,
    type: meta.type,
    price: meta.price,
    rent: meta.rent,
    group: meta.group,
  };
});

export const boardDefinition: BoardDefinition = {
  tiles,
};
