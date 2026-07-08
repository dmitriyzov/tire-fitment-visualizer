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
  const faceX = geometry.rimVisualWidth / 2 + 0.018;
  const spokeLength = geometry.rimOpeningRadius * 0.82;
  const spokeRadius = geometry.rimOpeningRadius * 0.48;
  const spokeGap = geometry.rimOpeningRadius * 0.045;
  const spokeWidth = geometry.rimOpeningRadius * 0.075;

  return (
    <group>
      <mesh geometry={geometry.tireGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#44484c" roughness={0.74} metalness={0.02} />
      </mesh>

      <mesh geometry={geometry.wheelGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#c2c5c9" roughness={0.28} metalness={0.74} />
      </mesh>

      <mesh position={[faceX, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[geometry.rimOpeningRadius * 0.44, geometry.rimOpeningRadius * 0.48, 0.08, 72]} />
        <meshStandardMaterial color="#d6d8da" roughness={0.24} metalness={0.82} />
      </mesh>

      <mesh position={[faceX + 0.012, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[geometry.rimOpeningRadius * 0.18, geometry.rimOpeningRadius * 0.18, 0.092, 48]} />
        <meshStandardMaterial color="#f4f2ee" roughness={0.34} metalness={0.42} />
      </mesh>

      <mesh position={[faceX + 0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[geometry.rimOpeningRadius * 0.87, geometry.rimOpeningRadius * 0.018, 12, 96]} />
        <meshStandardMaterial color="#eef0f1" roughness={0.22} metalness={0.88} />
      </mesh>

      <mesh position={[faceX + 0.024, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[geometry.rimOpeningRadius * 0.72, geometry.rimOpeningRadius * 0.014, 12, 96]} />
        <meshStandardMaterial color="#a9adb1" roughness={0.38} metalness={0.74} />
      </mesh>

      {Array.from({ length: 6 }).map((_, pairIndex) =>
        [-1, 1].map((side) => {
          const angle = (pairIndex / 6) * Math.PI * 2 + side * 0.045;
          const y = Math.sin(angle) * spokeRadius + Math.cos(angle) * side * spokeGap;
          const z = Math.cos(angle) * spokeRadius - Math.sin(angle) * side * spokeGap;

          return (
            <mesh
              key={`${pairIndex}-${side}`}
              position={[faceX + 0.035, y, z]}
              rotation={[angle, 0, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.09, spokeWidth, spokeLength]} />
              <meshStandardMaterial color="#d8dadc" roughness={0.24} metalness={0.86} />
            </mesh>
          );
        }),
      )}

      {Array.from({ length: 5 }).map((_, index) => {
        const angle = (index / 5) * Math.PI * 2 + Math.PI / 5;
        const radius = geometry.rimOpeningRadius * 0.32;

        return (
          <mesh
            key={angle}
            position={[faceX + 0.07, Math.sin(angle) * radius, Math.cos(angle) * radius]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[geometry.rimOpeningRadius * 0.045, geometry.rimOpeningRadius * 0.045, 0.05, 24]} />
            <meshStandardMaterial color="#4a4d50" roughness={0.45} metalness={0.58} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function TireVisualizer({ spec }: TireVisualizerProps) {
  return (
    <div className="visualizer">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[2.8, 0, 7.5]} fov={40} />
        <color attach="background" args={['#f6f3ee']} />
        <ambientLight intensity={1.55} />
        <directionalLight position={[2.8, 3.5, 4.5]} intensity={2.1} castShadow />
        <directionalLight position={[-3, -1, 2]} intensity={1.05} />
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
