import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { type TireSpec } from './calculations';
import { createTireGeometry } from './tireGeometry';

type TireVisualizerProps = {
  spec: TireSpec;
};

function WheelAndTire({ spec }: TireVisualizerProps) {
  const geometry = useMemo(() => createTireGeometry(spec), [spec]);

  return (
    <group>
      <mesh geometry={geometry.tireGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#44484c" roughness={0.74} metalness={0.02} />
      </mesh>

      <mesh geometry={geometry.wheelGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#c2c5c9" roughness={0.28} metalness={0.74} />
      </mesh>
    </group>
  );
}

export default function TireVisualizer({ spec }: TireVisualizerProps) {
  return (
    <div className="visualizer">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[-3.15, 0, 7.5]} fov={40} />
        <color attach="background" args={['#f6f3ee']} />
        <ambientLight intensity={1.55} />
        <directionalLight position={[2.8, 3.5, 4.5]} intensity={2.1} castShadow />
        <directionalLight position={[-3, -1, 2]} intensity={1.05} />
        <WheelAndTire spec={spec} />
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={4.2}
          maxDistance={10}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.7}
          zoomSpeed={0.45}
        />
      </Canvas>
    </div>
  );
}
