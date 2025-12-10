'use client';

import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, Float, Environment, SoftShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

// --- Utils ---
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// --- Components ---

// Helper to merge geometries (simple version for this specific use case)
const mergeGeometries = (geometries: THREE.BufferGeometry[]) => {
    const mergedGeometry = new THREE.BufferGeometry();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    let offset = 0;
    
    geometries.forEach(geom => {
        const pos = geom.attributes.position.array;
        const norm = geom.attributes.normal.array;
        const ind = geom.index?.array;
        
        if (pos) {
            for (let i = 0; i < pos.length; i++) positions.push(pos[i]);
        }
        if (norm) {
            for (let i = 0; i < norm.length; i++) normals.push(norm[i]);
        }
        if (ind) {
            for (let i = 0; i < ind.length; i++) indices.push(ind[i] + offset);
        }
        
        offset += (pos.length / 3);
    });
    
    mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    mergedGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    if (indices.length > 0) mergedGeometry.setIndex(indices);
    
    return mergedGeometry;
};

const RealisticFoliage = () => {
  // Increased count for denser, more realistic look
  const count = 2500;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate custom "Pine Tuft" geometry
  const pineTuftGeometry = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];
    const needleCount = 6;
    
    for (let i = 0; i < needleCount; i++) {
        // Thin cylinder for a needle
        const geo = new THREE.CylinderGeometry(0.02, 0.04, 1.2, 4);
        
        // Rotate and position to form a tuft
        const angle = (i / needleCount) * Math.PI * 2 + Math.random() * 0.5;
        const lean = Math.PI / 4 + Math.random() * 0.2; // Lean outwards
        
        geo.rotateX(lean);
        geo.rotateY(angle);
        geo.translate(0, 0, 0); // Center at origin
        
        geometries.push(geo);
    }
    
    return mergeGeometries(geometries);
  }, []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    
    const treeHeight = 7;
    const maxRadius = 2.5;

    for (let i = 0; i < count; i++) {
      // Layered distribution for pine tree look
      const layer = Math.floor(Math.random() * 8); // 8 layers of branches
      const layerHeight = treeHeight / 8;
      
      // Position within layer
      const h = (layer + Math.random()) / 8;
      const y = h * treeHeight;
      
      // Cone shape radius at this height
      const rBase = (1 - h) * maxRadius;
      // Push branches out to surface more
      const r = rBase * (0.4 + Math.random() * 0.6); 
      
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      dummy.position.set(x, y, z);
      
      // Point outwards and slightly up
      dummy.lookAt(0, y + 2, 0); 
      // Random rotation for natural look
      dummy.rotateX(Math.PI / 2 + randomRange(-0.3, 0.3));
      dummy.rotateY(randomRange(0, Math.PI * 2));
      dummy.rotateZ(randomRange(-0.3, 0.3));

      // Thinner, longer branches/needles
      const scale = randomRange(0.2, 0.5);
      dummy.scale.set(scale * 0.5, scale * 1.5, scale * 0.5);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Varied green hues: darker inside, lighter tips
      const isTip = r > rBase * 0.8;
      const hue = randomRange(0.28, 0.38); // Green range
      const sat = isTip ? randomRange(0.6, 0.8) : randomRange(0.3, 0.5);
      const light = isTip ? randomRange(0.3, 0.5) : randomRange(0.1, 0.2);
      
      const color = new THREE.Color().setHSL(hue, sat, light);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} receiveShadow position={[0, 0.5, 0]}>
      <primitive object={pineTuftGeometry} attach="geometry" />
      <meshStandardMaterial roughness={0.9} metalness={0.1} />
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
  return (
    <group position={[0, 7.8, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        {/* Core Moon */}
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#fffacd" emissive="#fffacd" emissiveIntensity={4} toneMapped={false} />
        </mesh>
        {/* Glow Halo */}
        <pointLight color="#fffacd" intensity={2} distance={10} decay={2} />
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
  // Create strips that look like they are draped over the gifts
  const strips = useMemo(() => {
    const items: THREE.CatmullRomCurve3[] = [];
    // Gift cluster approximate locations
    const clusters = [
        { x: 2.5, z: 0 },
        { x: -1.4, z: 2.4 }, // ~120 deg
        { x: -1.3, z: -2.2 } // ~240 deg
    ];
    
    // Pick 1 or 2 clusters to have lights on them
    const activeClusters = clusters.sort(() => Math.random() - 0.5).slice(0, Math.random() > 0.5 ? 2 : 1);

    activeClusters.forEach(cluster => {
        // Create a messy coil/curve on top of this cluster
        const points = [];
        const coilCount = 15;
        for(let i=0; i<coilCount; i++) {
            const t = i / coilCount;
            const angle = t * Math.PI * 4; // 2 loops
            const r = 0.6 + Math.random() * 0.3;
            
            // Center on the cluster
            const cx = cluster.x + Math.cos(angle) * r;
            const cz = cluster.z + Math.sin(angle) * r;
            // Height varies to look like it's on boxes (0.3 to 0.8)
            const cy = 0.4 + Math.sin(t * Math.PI * 3) * 0.2 + Math.random() * 0.2;
            
            points.push(new THREE.Vector3(cx, cy, cz));
        }
        const curve = new THREE.CatmullRomCurve3(points, false);
        items.push(curve);
    });
    
    return items;
  }, []);

  return (
    <group>
      {strips.map((curve, i) => (
        <group key={i}>
          <mesh>
            <tubeGeometry args={[curve, 64, 0.04, 8, false]} />
            <meshStandardMaterial color="#ffaa33" emissive="#ffaa33" emissiveIntensity={3} toneMapped={false} />
          </mesh>
          {/* A few point lights for glow */}
          <pointLight position={curve.getPoint(0.5)} color="#ffaa33" intensity={0.8} distance={3} decay={2} />
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
  const [isInteractive, setIsInteractive] = useState(false);
  const [snowSpeed, setSnowSpeed] = useState(0.2); // Default slow speed

  // Reset interactivity when controls are hidden
  React.useEffect(() => {
    if (!showControls) {
      setIsInteractive(false);
    }
  }, [showControls]);

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

        <group position={[0, -1, 0]}>
            <Trunk />
            <RealisticFoliage />
            <FairyLights />
            <Ornaments />
            <Moon />
            <Ground />
            <Gifts />
            <LightStrips />
        </group>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        <Snow speed={snowSpeed} />
        
        <OrbitControls 
            enableZoom={isInteractive} 
            enablePan={isInteractive} 
            enableRotate={isInteractive}
            autoRotate={!isInteractive}
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
