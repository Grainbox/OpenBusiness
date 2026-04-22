interface PlayerPawnProps {
  position: [number, number, number];
  color: string;
  offset?: [number, number];
}

const PAWN_SIZE = 0.3;
const PAWN_HEIGHT = 0.4;

export default function PlayerPawn({
  position,
  color,
  offset = [0, 0],
}: PlayerPawnProps) {
  const [x, y, z] = position;
  const [offsetX, offsetZ] = offset;

  return (
    <group position={[x + offsetX, y, z + offsetZ]}>
      <mesh position={[0, PAWN_HEIGHT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[PAWN_SIZE, PAWN_HEIGHT, PAWN_SIZE]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}
