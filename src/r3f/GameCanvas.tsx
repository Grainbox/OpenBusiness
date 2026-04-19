import { Canvas } from '@react-three/fiber';
import IsometricCamera from './camera/IsometricCamera';
import SceneLights from './lights/SceneLights';
import TestCube from './objects/TestCube';

export default function GameCanvas() {
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
      <TestCube />
    </Canvas>
  );
}
