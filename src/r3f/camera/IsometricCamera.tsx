import { useRef, useEffect } from 'react';
import { OrthographicCamera } from '@react-three/drei';
import { OrthographicCamera as ThreeOrthoCamera } from 'three';

export default function IsometricCamera() {
  const ref = useRef<ThreeOrthoCamera>(null);

  useEffect(() => {
    ref.current?.lookAt(0, 0, 0);
  }, []);

  return (
    <OrthographicCamera
      ref={ref}
      makeDefault
      position={[10, 10, 10]}
      zoom={50}
      near={0.1}
      far={1000}
    />
  );
}
