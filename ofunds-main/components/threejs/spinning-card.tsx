"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Box, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Card component with spinning animation
function Card({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state: any, delta: number) => {
    if (meshRef.current) {
      // Fine spinning animation - very smooth and precise
      meshRef.current.rotation.y += delta * 0.3; // Slow, smooth rotation
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05; // Subtle floating effect
      
      // Hover effect with smooth scaling
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Box
      ref={meshRef}
      position={position}
      args={[3.4, 2.1, 0.1]} // Credit card proportions
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color="#1a1a1a"
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
      />
      
      {/* Card Front Content */}
      <group position={[0, 0, 0.06]}>
        {/* Ofunds Logo */}
        <Text
          position={[-1.2, 0.6, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
        >
          OFUNDS
        </Text>
        
        {/* Card Number */}
        <Text
          position={[-1.2, 0, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
        >
          1234 5678 9012 3456
        </Text>
        
        {/* Card Holder Name */}
        <Text
          position={[-1.2, -0.4, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
        >
          JOHN DOE
        </Text>
        
        {/* Expiry Date */}
        <Text
          position={[1.2, -0.4, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="right"
          anchorY="middle"
        >
          12/25
        </Text>
        
        {/* Chip */}
        <Box position={[-1.2, 0.3, 0.02]} args={[0.4, 0.3, 0.05]}>
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.9}
            roughness={0.1}
          />
        </Box>
      </group>
      
      {/* Card Back Content */}
      <group position={[0, 0, -0.06]} rotation={[0, Math.PI, 0]}>
        {/* Magnetic Stripe */}
        <Box position={[0, 0.5, 0.02]} args={[3.2, 0.3, 0.05]}>
          <meshStandardMaterial color="#000000" />
        </Box>
        
        {/* Signature Panel */}
        <Box position={[0, -0.2, 0.02]} args={[2, 0.4, 0.05]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        
        {/* CVV */}
        <Text
          position={[1.2, -0.2, 0.03]}
          fontSize={0.12}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          123
        </Text>
      </group>
      
      {/* Card Edge Highlight */}
      <Box args={[3.4, 2.1, 0.02]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          metalness={1}
          roughness={0.1}
          transparent
          opacity={0.1}
        />
      </Box>
    </Box>
  );
}

// Main SpinningCard component
export function SpinningCard() {
  return (
    <div className="w-full h-96 relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        className="w-full h-full"
      >
        {/* Professional Lighting Setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.8} />
        
        {/* Spinning Card */}
        <Card position={[0, 0, 0]} />
        
        {/* Subtle camera controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
        
        {/* Environment */}
        <mesh position={[0, 0, -5]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
      </Canvas>
      
      {/* Overlay Text */}
      <div className="absolute top-4 left-4 text-white bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
        <p className="text-sm font-medium">Ofunds Premium Card</p>
        <p className="text-xs opacity-75">Hover to interact</p>
      </div>
    </div>
  );
}
