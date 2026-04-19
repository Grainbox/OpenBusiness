import { Canvas } from '@react-three/fiber';
import IsometricCamera from './camera/IsometricCamera';
import SceneLights from './lights/SceneLights';
import BoardMesh from './objects/BoardMesh';

interface GameCanvasProps {
  showAllLabels?: boolean;
}

export default function GameCanvas({ showAllLabels }: GameCanvasProps) {
  return (
    <Canvas
      shadows
      frameloop="demand"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    >
      <IsometricCamera />
      <SceneLights />
      <BoardMesh showAllLabels={showAllLabels} />
    </Canvas>
  );
}
