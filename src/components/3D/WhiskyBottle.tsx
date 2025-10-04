import { FC, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Bottle() {
  const bottleRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (bottleRef.current) {
      bottleRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={bottleRef}>
      {/* Bottle Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 2, 32]} />
        <meshPhysicalMaterial
          color="#1a0f0a"
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Bottle Neck */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.6, 32]} />
        <meshPhysicalMaterial
          color="#1a0f0a"
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Cap */}
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.3, 32]} />
        <meshStandardMaterial color="#d4622a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Liquid */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.28, 0.33, 1.4, 32]} />
        <meshPhysicalMaterial
          color="#e9821c"
          transparent
          opacity={0.7}
          roughness={0}
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>
    </group>
  );
}

export const WhiskyBottle: FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d4622a" />
      <Bottle />
      <Environment preset="sunset" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
};
