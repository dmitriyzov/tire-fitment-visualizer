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
        <meshStandardMaterial color="#121315" roughness={0.82} metalness={0.04} />
      </mesh>

      <mesh geometry={geometry.wheelGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#777b82" roughness={0.38} metalness={0.82} />
      </mesh>
    </group>
  );
}

export default function TireVisualizer({ spec }: TireVisualizerProps) {
  return (
    <div className="visualizer">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[2.8, 0, 7.5]} fov={40} />
        <color attach="background" args={['#f6f3ee']} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[2.8, 3.5, 4.5]} intensity={2.2} castShadow />
        <directionalLight position={[-3, -1, 2]} intensity={0.75} />
        <WheelAndTire spec={spec} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}
