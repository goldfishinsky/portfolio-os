'use client';

import React, { useMemo, useRef, useState, useLayoutEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, Float, Environment, SoftShadows, useTexture, Text } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Monkey } from './Monkey';

// --- Utils ---
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// --- Components ---

const RealisticFoliage = () => {
  // Optimized count for background wallpaper performance
  const count = 600;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    
    // Tree shape parameters
    const treeHeight = 7;
    const maxRadius = 2.5;

    for (let i = 0; i < count; i++) {
      // Normalized height (0 at bottom, 1 at top)
      const h = Math.random(); 
      const y = h * treeHeight;
      
      // Cone shape radius at this height
      const r = (1 - h) * maxRadius;
      
      // Random position within the cone volume (concentrated on surface)
      const angle = Math.random() * Math.PI * 2;
      const radius = r * Math.sqrt(Math.random()); // Sqrt for uniform distribution
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      dummy.position.set(x, y, z);
      
      // Rotate to point outwards/upwards
      dummy.lookAt(0, y + 1, 0); 
      dummy.rotateX(Math.PI / 2 + randomRange(-0.2, 0.2));
      dummy.rotateY(randomRange(0, Math.PI * 2));
      dummy.rotateZ(randomRange(-0.2, 0.2));

      // Random scale for variety
      const scale = randomRange(0.15, 0.35);
      dummy.scale.set(scale, scale, scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Vary color slightly for realism
      const color = new THREE.Color().setHSL(randomRange(0.25, 0.35), randomRange(0.4, 0.8), randomRange(0.1, 0.3));
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} receiveShadow position={[0, 0.5, 0]}>
      <coneGeometry args={[0.5, 1.5, 4]} />
      <meshStandardMaterial roughness={0.8} metalness={0.1} />
    </instancedMesh>
  );
};

// ... (Keep other components as is)

// ... (Keep other components as is)



const FairyLights = () => {
  const count = 100;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    const turns = 8;
    const height = 7;
    const maxRadius = 2.6;
    
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const y = t * height + 0.5;
      const r = (1 - t) * maxRadius + 0.2; // Slightly outside the tree
      const angle = t * Math.PI * 2 * turns;
      
      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Warm white and gold alternating
      const color = new THREE.Color(i % 2 === 0 ? '#ffaa00' : '#ffddaa');
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshStandardMaterial 
        emissive="#ffaa00"
        emissiveIntensity={2} 
        toneMapped={false} 
      />
    </instancedMesh>
  );
};

const Ornaments = () => {
  const count = 60;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    const colors = ['#ff0000', '#ffd700', '#c0c0c0', '#ff3333']; // gold, silver
    const height = 6.5;
    const maxRadius = 2.2;

    for (let i = 0; i < count; i++) {
        const h = Math.random();
        const y = h * height + 0.8;
        const r = (1 - h) * maxRadius * 0.9; // Inside the foliage slightly
        const angle = Math.random() * Math.PI * 2;
        
        dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
        
        const scale = randomRange(0.12, 0.18);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        
        meshRef.current.setMatrixAt(i, dummy.matrix);
        
        const colorHex = colors[Math.floor(Math.random() * colors.length)];
        meshRef.current.setColorAt(i, new THREE.Color(colorHex));
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        metalness={0.9} 
        roughness={0.1} 
        envMapIntensity={1}
      />
    </instancedMesh>
  );
};

const Moon = () => {
  const texture = useTexture('/moon_hand_drawn.png');
  
  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTexture: { value: texture },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(uTexture, vUv);
        
        // 1. White Background Removal (Chroma Key)
        // Discard if pixel is very bright white (background)
        // We check if all channels are > 0.9
        if (color.r > 0.9 && color.g > 0.9 && color.b > 0.9) discard;

        // 2. Brightness calculation
        float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        
        // 3. Emission & Shadow Logic
        // High brightness (Beige) -> Glow
        // Low brightness (Marker) -> Stay Dark (or get darker)
        
        float emissionFactor = smoothstep(0.5, 0.8, brightness);
        vec3 finalColor = color.rgb + (color.rgb * emissionFactor * 5.0);
        
        // Deepen the shadows for the "Marker" part to ensure high contrast
        if (brightness < 0.5) {
            finalColor *= 0.5; 
        }
        
        gl_FragColor = vec4(finalColor, color.a);
      }
    `,
    transparent: true,
  }), [texture]);

  return (
    <group position={[0, 7.8, 0]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh rotation={[0, 0, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <shaderMaterial args={[shaderArgs]} side={THREE.DoubleSide} transparent />
        </mesh>
        {/* Easter Egg Text - Wrapped in Suspense to prevent blocking the whole scene */}
        <Suspense fallback={null}>
          <Text
            position={[-0.12, -0.28, 0.01]} // Top-left of the lowest point
            fontSize={0.008} 
            color="#555555" // Grey
            anchorX="center"
            anchorY="middle"
          >
            by ziqian
          </Text>
        </Suspense>
        {/* Glow Halo */}
        <pointLight color="#ffddaa" intensity={0.8} distance={10} decay={2} position={[0, 0, 1]} />
      </Float>
    </group>
  );
};

const Trunk = () => {
    return (
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.5, 2, 16]} />
            <meshStandardMaterial color="#3e2723" roughness={1} />
        </mesh>
    );
};

const Ground = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#eef2ff" roughness={0.5} metalness={0.1} />
        </mesh>
    );
};

// ... (Keep other components as is)

const Gifts = () => {
  const gifts = useMemo(() => {
    const items = [];
    const colors = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7'];
    
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
      const r = 2.5 + Math.random() * 2;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const scale = randomRange(0.4, 0.7);
      
      items.push({
        position: [x, scale/2, z] as [number, number, number],
        rotation: [0, Math.random() * Math.PI, 0] as [number, number, number],
        scale: [scale, scale, scale] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    return items;
  }, []);

  return (
    <group>
      {gifts.map((g, i) => (
        <group key={i} position={g.position} rotation={g.rotation}>
          {/* Box */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[g.scale[0], g.scale[1], g.scale[2]]} />
            <meshStandardMaterial color={g.color} roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Ribbon Vertical */}
          <mesh position={[0, 0, 0]} scale={[1.02, 1.02, 0.2]}>
            <boxGeometry args={[g.scale[0], g.scale[1], g.scale[2]]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.5} />
          </mesh>
          {/* Ribbon Horizontal */}
          <mesh position={[0, 0, 0]} scale={[0.2, 1.02, 1.02]}>
            <boxGeometry args={[g.scale[0], g.scale[1], g.scale[2]]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const LightStrips = () => {
  // Create a few "strips" of warm light on the ground/gifts
  const strips = useMemo(() => {
    const items = [];
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5;
      const r = 3.0;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      items.push({ position: [x, 0.1, z] as [number, number, number] });
    }
    return items;
  }, []);

  return (
    <group>
      {strips.map((s, i) => (
        <group key={i} position={s.position}>
          {/* Glowing Strip Geometry */}
          <mesh rotation={[Math.PI/2, 0, Math.random() * Math.PI]}>
            <torusGeometry args={[0.8, 0.05, 8, 32, Math.PI]} />
            <meshStandardMaterial color="#ffaa33" emissive="#ffaa33" emissiveIntensity={5} toneMapped={false} />
          </mesh>
          {/* Light Source for the Strip */}
          <pointLight color="#ffaa33" intensity={1.5} distance={4} decay={2} position={[0, 0.5, 0]} />
        </group>
      ))}
    </group>
  );
};

const Snow = ({ speed }: { speed: number }) => {
  const count = 2000;
  
  // Initial positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;     // x
      pos[i * 3 + 1] = Math.random() * 20;         // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25; // z
    }
    return pos;
  }, []);

  // Random parameters for each flake (speed, size, drift offset)
  const randoms = useMemo(() => {
    const r = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      r[i * 3] = Math.random();     // speed multiplier
      r[i * 3 + 1] = Math.random(); // size multiplier
      r[i * 3 + 2] = Math.random(); // drift offset
    }
    return r;
  }, []);

  const shaderArgs = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      globalSpeed: { value: speed },
      color: { value: new THREE.Color('#ffffff') }
    },
    vertexShader: `
      uniform float time;
      uniform float globalSpeed;
      attribute vec3 randoms;
      varying float vAlpha;
      
      void main() {
        float speed = (1.0 + randoms.x * 2.0) * globalSpeed;
        float size = randoms.y;
        float driftOffset = randoms.z * 6.28;
        
        vec3 pos = position;
        
        // Fall down
        pos.y = position.y - mod(time * speed, 20.0);
        if (pos.y < 0.0) pos.y += 20.0; // Wrap around
        
        // Drift
        pos.x += sin(time * 0.5 + driftOffset) * 0.5;
        pos.z += cos(time * 0.3 + driftOffset) * 0.5;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Size attenuation
        gl_PointSize = (4.0 * size + 2.0) * (10.0 / -mvPosition.z);
        
        // Fade out near bottom
        vAlpha = smoothstep(0.0, 2.0, pos.y);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vAlpha;
      
      void main() {
        // Soft circle shape
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        if (dist > 0.5) discard;
        
        float alpha = (0.5 - dist) * 2.0 * vAlpha;
        gl_FragColor = vec4(color, alpha * 0.8);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  useFrame((state) => {
    if (shaderArgs.uniforms) {
      shaderArgs.uniforms.time.value = state.clock.getElapsedTime();
      shaderArgs.uniforms.globalSpeed.value = speed;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-randoms"
          count={count}
          array={randoms}
          itemSize={3}
          args={[randoms, 3]}
        />
      </bufferGeometry>
      <shaderMaterial args={[shaderArgs]} />
    </points>
  );
};

export const ChristmasScene: React.FC<{ showControls: boolean }> = ({ showControls }) => {
  const [isInteractive, setIsInteractive] = useState(true);
  const [snowSpeed, setSnowSpeed] = useState(0.2); // Default slow speed

  // Reset interactivity when controls are hidden - DISABLED by user request
  // React.useEffect(() => {
  //   if (!showControls) {
  //     setIsInteractive(false);
  //   }
  // }, [showControls]);

  return (
    <div className={`absolute inset-0 w-full h-full bg-[#050a14] transition-all duration-500 ${isInteractive ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <Canvas 
        shadows 
        dpr={[1, 1.5]} 
        gl={{ antialias: false, powerPreference: "high-performance" }}
        performance={{ min: 0.5 }}
        camera={{ position: [0, 2, 18], fov: 45 }}
      >
        <fog attach="fog" args={['#050a14', 10, 40]} />
        
        {/* Lighting Setup for "Warm & Moonlit" look */}
        <ambientLight intensity={0.1} />
        
        {/* Moonlight (Cool Blue) */}
        <directionalLight 
          position={[5, 10, -5]} 
          intensity={1.5} 
          color="#aaccff" 
          castShadow 
          shadow-bias={-0.0001}
          shadow-mapSize={[512, 512]}
        />
        
        {/* Warm Fill from Tree Lights */}
        <pointLight position={[2, 4, 2]} intensity={1} color="#ffaa00" distance={10} />
        <pointLight position={[-2, 2, 3]} intensity={1} color="#ffaa00" distance={10} />
        {/* Central Tree Glow (compensating for removed individual lights) */}
        <pointLight position={[0, 3, 0]} intensity={2} color="#ffaa00" distance={8} decay={2} />

        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
              <Trunk />
              <RealisticFoliage />
              <FairyLights />
              <Ornaments />
              <Moon />
              <Ground />
              <Gifts />
              <LightStrips />
              <Monkey 
                position={[2, 0, 2]} 
                scale={[0.5, 0.5, 0.5]} 
                treeHeight={7}
                treeRadius={2.5}
              />
          </group>
        </Suspense>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        <Snow speed={snowSpeed} />
        
        <OrbitControls 
            enableZoom={isInteractive} 
            enablePan={isInteractive} 
            enableRotate={isInteractive}
            autoRotate={false}
            autoRotateSpeed={0.5}
            target={[0, 2, 0]}
        />

        {/* Post Processing for the "Magical" Look */}
        <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
      </Canvas>

      {/* Control Panel */}
      <div className={`absolute top-24 right-4 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white pointer-events-auto flex flex-col gap-4 w-64 z-50 transition-all duration-300 ${showControls ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Interactive Mode</span>
            <button 
                onClick={() => setIsInteractive(!isInteractive)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isInteractive ? 'bg-green-500' : 'bg-gray-600'}`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isInteractive ? 'left-7' : 'left-1'}`} />
            </button>
        </div>
        
        <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-gray-300">
                <span>Snow Speed</span>
                <span>{Math.round(snowSpeed * 10)}</span>
            </div>
            <input 
                type="range" 
                min="0" 
                max="2" 
                step="0.1" 
                value={snowSpeed} 
                onChange={(e) => setSnowSpeed(parseFloat(e.target.value))}
                className="w-full accent-white h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
        </div>
        
        <div className="text-[10px] text-gray-400 text-center">
            {isInteractive ? 'Mouse controls enabled. Desktop clicks blocked.' : 'Wallpaper mode. Desktop clickable.'}
        </div>
      </div>
    </div>
  );
};
