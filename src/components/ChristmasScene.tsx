'use client';

import React, { useMemo, useRef, useState, useLayoutEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, Float, Environment, SoftShadows, useTexture, Text, Line } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
// import { Monkey } from './Monkey';

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
      <meshStandardMaterial 
        roughness={0.8} 
        metalness={0.1}
        onBeforeCompile={(shader) => {
          shader.vertexShader = `
            varying vec3 vWorldNormal;
            ${shader.vertexShader}
          `.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            // Approximation: transform normal to view space (vNormal usage later)
            // But for snow, we want World Space "Up".
            // Since the camera moves, View Space "Up" changes.
            // "World Up" (0,1,0) in View Space is (viewMatrix * vec4(0,1,0,0)).xyz
            `
          );
          
          shader.fragmentShader = `
            ${shader.fragmentShader}
          `.replace(
            '#include <color_fragment>',
            `
            #include <color_fragment>
            
            // Calculate snow
            // View Space Up Vector
            vec3 viewUp = normalize(vec3(viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)));
            
            // vNormal is in View Space (standard material)
            float snowFactor = dot(normalize(vNormal), viewUp);
            
            // Snow threshold - only top surfaces
            // Smoothstep for soft edge
            // Lower threshold (0.1) allows snow on steeper slopes, making it look "thicker"
            float snowCoverage = smoothstep(0.1, 0.5, snowFactor);
            
            // Mix white snow color
            // Use varying noise to make it less uniform? 
            // For now, simple white mix
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.95, 0.95, 1.0), snowCoverage * 0.9);
            `
          );
        }}
      />
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

const Moon = ({ intensity = 0.8 }: { intensity?: number }) => {
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
        <pointLight color="#ffddaa" intensity={intensity} distance={10} decay={2} position={[0, 0, 1]} />
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
            <planeGeometry args={[400, 400]} />
            <meshStandardMaterial color="#eef2ff" roughness={1} metalness={0} />
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
const Snow = ({ speed, windX, turbulence, size }: { speed: number, windX: number, turbulence: number, size: number }) => {
  const count = 8000;
  
  const { positions, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count * 3); 
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 40; 
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;

      rnd[i * 3] = Math.random();     
      rnd[i * 3 + 1] = Math.random(); 
      rnd[i * 3 + 2] = Math.random(); 
    }
    return { positions: pos, randoms: rnd };
  }, []);

const shaderArgs = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      globalSpeed: { value: speed },
      windX: { value: windX },
      turbulence: { value: turbulence },
      sizeMultiplier: { value: size },
      color: { value: new THREE.Color('#ffffff') }
    },
    vertexShader: `
      uniform float time;
      uniform float globalSpeed;
      uniform float windX;
      uniform float turbulence;
      uniform float sizeMultiplier;
      
      attribute vec3 randoms;
      
      varying float vAlpha;
      varying float vRotation;
      
      void main() {
        float individualSpeed = (0.2 + randoms.x * 0.8) * globalSpeed; 
        float individualSize = randoms.y;
        
        vec3 pos = position;
        
        // 1. Gravity (Falling Down)
        float fallDistance = time * individualSpeed * 5.0;
        pos.y = mod(position.y - fallDistance, 40.0) - 10.0; // Range -10 to 30
        
        // 2. Wind
        pos.x += windX * time * 5.0 * individualSpeed;
        pos.x = mod(pos.x + 60.0, 120.0) - 60.0; 
        
        // 3. Turbulence (Swaying)
        float t = time * 0.5;
        float swayOffset = randoms.z * 6.28;
        
        float swayX = sin(t + swayOffset + pos.y * 0.1) * 2.0; 
        float swayZ = cos(t * 0.8 + swayOffset + pos.y * 0.1) * 2.0;
        
        pos.x += swayX * turbulence;
        pos.z += position.z + swayZ * turbulence;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Size
        float baseSize = (6.0 * individualSize + 4.0) * sizeMultiplier;
        gl_PointSize = baseSize * (20.0 / -mvPosition.z);
        
        // Rotation (Tumbling)
        // Spin speed depends on random factor
        float spinSpeed = (randoms.z - 0.5) * 4.0; 
        vRotation = time * spinSpeed + randoms.x * 6.28;
        
        // Fade boundary
        float topFade = smoothstep(30.0, 25.0, pos.y);
        float bottomFade = smoothstep(-10.0, -5.0, pos.y);
        vAlpha = topFade * bottomFade;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vAlpha;
      varying float vRotation;
      
      const float PI = 3.14159265;

      // Hexagonal fold
      // Maps 2D position to a single sector (0 to 60 degrees) of a hexagon
      // to exploit radial symmetry.
      vec2 fold(vec2 p) {
        float r = length(p);
        float a = atan(p.y, p.x);
        float segment = PI / 3.0; // 60 degrees
        a = mod(a, segment) - segment * 0.5; // -30 to +30
        return vec2(cos(a), sin(a)) * r;
      }

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float dist = length(uv);
        if (dist > 0.5) discard;
        
        // 1. Rotate the flake
        float c = cos(vRotation);
        float s = sin(vRotation);
        vec2 p = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
        
        // 2. Make it crisp and icy
        // Use polar folding for 6-fold symmetry
        vec2 folded = fold(p);
        
        // 3. Draw the dendritic shape
        // We are now in a wedge.
        // Let's create a main crystal definition.
        
        // Main beam thickness
        // Coordinate 'folded.x' is distance along the 0-degree ray (center of wedge)
        // Coordinate 'folded.y' is distance perpendicular to it
        
        float r = length(p);
        
        // Shape function:
        // A main beam along x-axis (in folded space)
        float beam = 1.0 - smoothstep(0.005, 0.025, abs(folded.y));
        
        // Branches
        // "V" shapes coming off the main beam
        // We can simulate this by checking distance to angled lines
        float branchD = abs(folded.y - abs(folded.x - 0.2) * 1.5);
        float branches = 1.0 - smoothstep(0.005, 0.025, branchD);
        
        // Combine
        float shape = max(beam, branches);
        
        // Mask with a fading radius (so it doesn't look like infinite lines)
        shape *= smoothstep(0.5, 0.3, r);
        
        // Soft Glow core
        float core = exp(-r * 10.0);
        
        // Final mix
        float alpha = max(shape, core);
        
        // Slight noise/sparkle could be added, but clean crystal is often better
        alpha = clamp(alpha, 0.0, 1.0);
        
        gl_FragColor = vec4(color, alpha * vAlpha);
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
      shaderArgs.uniforms.windX.value = windX;
      shaderArgs.uniforms.turbulence.value = turbulence;
      shaderArgs.uniforms.sizeMultiplier.value = size;
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

const Sun = () => {
    // Simple glow shader
    const shaderArgs = useMemo(() => ({
        uniforms: {
            color: { value: new THREE.Color('#ffaa33') },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            varying vec2 vUv;
            void main() {
                vec2 center = vec2(0.5);
                float dist = length(vUv - center);
                float alpha = smoothstep(0.5, 0.4, dist); // Soft edge
                float core = smoothstep(0.2, 0.0, dist); // Bright core
                
                vec3 finalColor = color + vec3(1.0) * core * 0.5;
                if (alpha < 0.01) discard;
                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true,
    }), []);

    return (
        <group scale={[6, 6, 6]}> {/* Scaled up for distance */}
            <mesh>
                <planeGeometry args={[10, 10]} />
                <shaderMaterial args={[shaderArgs]} transparent />
            </mesh>
            <pointLight color="#ff8800" intensity={2} distance={200} decay={1} />
        </group>
    );
};



const Constellations = () => {
    // Star coordinates (approximate spherical positions)
    const stars = useMemo(() => {
        const items: { pos: [number, number, number], size: number }[] = [];
        const radius = 90; // Just inside fog

        // Helper to convert RA/Dec-ish to 3D
        const addStar = (ra: number, dec: number, size: number = 1.2) => {
            const phi = (90 - dec) * (Math.PI / 180);
            const theta = (ra * 15) * (Math.PI / 180); // RA in hours to degrees
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.sin(theta);
            items.push({ pos: [x, y, z], size });
        };

        // Ursa Major (Big Dipper)
        addStar(11, 61, 2.0);
        addStar(11, 56, 2.0);
        addStar(11.8, 53, 1.8);
        addStar(12.2, 57, 1.8);
        addStar(12.9, 56, 2.0);
        addStar(13.4, 55, 2.0);
        addStar(13.8, 49, 2.2);

        // Orion
        // Belt
        addStar(5.6, -1.9, 2.2);
        addStar(5.6, -1.2, 2.2);
        addStar(5.5, -0.3, 2.2);
        // Shoulders
        addStar(5.9, 7.4, 2.8); // Betelgeuse (extra bright)
        addStar(5.4, 6.3, 2.2);
        // Feet
        addStar(5.2, -8.2, 2.5); // Rigel
        addStar(5.8, -9.6, 2.2);

        // Cassiopeia (W Shape) - RA ~0-1h, Dec ~60
        addStar(0.1, 59, 2.0); // Caph
        addStar(0.7, 56, 2.2); // Schedar
        addStar(0.9, 60, 2.1); // Gamma
        addStar(1.4, 60, 2.0); // Ruchbah
        addStar(1.9, 63, 1.9); // Segin

        // Cygnus (Northern Cross) - RA ~20h, Dec ~40
        addStar(20.7, 45, 2.5); // Deneb (Tail) - Bright!
        addStar(20.4, 40, 2.0); // Sadr (Center)
        addStar(19.5, 28, 2.0); // Albireo (Head)
        addStar(20.8, 30, 2.0); // Aljanah (Wing)
        addStar(19.8, 45, 2.0); // Fawaris (Wing)

        return items;
    }, []);

    // Pulsing animation
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.getElapsedTime();
        groupRef.current.children.forEach((child, i) => {
             // Twinkle effect: oscillate scale slightly
             if (child instanceof THREE.Mesh) {
                const twinkle = Math.sin(t * 3 + i * 10) * 0.2 + 1.0; 
                child.scale.setScalar(twinkle);
             }
        });
    });

    return (
        <group ref={groupRef} rotation={[0.5, 0, 0]}> {/* Tilt sky slightly */}
            {stars.map((s, i) => (
                <mesh key={i} position={s.pos}>
                    <sphereGeometry args={[0.3 * s.size, 16, 16]} />
                    <meshBasicMaterial color="#ffffff" toneMapped={false} />
                    {/* Stronger glow for visibility */}
                    <pointLight color="white" intensity={1.5} distance={15} />
                </mesh>
            ))}

            {/* Labels */}
            <group>
                 {/* Ursa Major */}
                 <Text position={[stars[3].pos[0], stars[3].pos[1] + 5, stars[3].pos[2]]} fontSize={2} color="white" fillOpacity={0.6}>
                    Ursa Major
                 </Text>
                 {/* Orion */}
                 <Text position={[stars[8].pos[0] + 5, stars[8].pos[1] - 5, stars[8].pos[2]]} fontSize={2} color="white" fillOpacity={0.6}>
                    Orion
                 </Text>
                 {/* Cassiopeia (Index 14-18, Center around 16) */}
                 <Text position={[stars[16].pos[0], stars[16].pos[1] + 5, stars[16].pos[2]]} fontSize={2} color="white" fillOpacity={0.6}>
                    Cassiopeia
                 </Text>
                 {/* Cygnus (Index 19-23, Center around 20) */}
                 <Text position={[stars[20].pos[0] + 2, stars[20].pos[1] + 5, stars[20].pos[2]]} fontSize={2} color="white" fillOpacity={0.6}>
                    Cygnus
                 </Text>
            </group>
        </group>
    );
};

export const SCENE_CONFIGS = {
  night: {
    bg: '#050a14',
    fogColor: '#050a14',
    fogNear: 20, 
    fogFar: 90, 
    ambientIntensity: 0.1,
    sunPosition: [20, 40, -20] as [number, number, number],
    sunColor: '#aaccff',
    sunIntensity: 1.5,
    fillLightColor: '#ffaa00',
    starOpacity: 1,
    bloomThreshold: 1,
    bloomIntensity: 1.5,
    celestialBody: 'moon' as const,
    moonGlow: 0.8
  },
  sunset: {
    bg: '#2a1b2e',
    fogColor: '#4a2b38',
    fogNear: 20,
    fogFar: 150, 
    ambientIntensity: 0.2,
    sunPosition: [0, 5, -300] as [number, number, number],
    sunColor: '#ff6622',
    sunIntensity: 2.5,
    fillLightColor: '#ff8844',
    starOpacity: 0.3,
    bloomThreshold: 0.8,
    bloomIntensity: 2.0,
    celestialBody: 'sun' as const,
    moonGlow: 0 // Moon visible but no light
  }
};

interface ChristmasSceneProps {
    isInteractive: boolean;
    snowSpeed: number;
    isSnowing: boolean;
    sceneMode: 'night' | 'sunset';
    windX: number;
    turbulence: number;
    snowflakeSize: number;
}

export const ChristmasScene: React.FC<ChristmasSceneProps> = ({ 
    isInteractive,
    snowSpeed,
    isSnowing,
    sceneMode,
    windX,
    turbulence,
    snowflakeSize
}) => {
  const config = SCENE_CONFIGS[sceneMode];

  return (
    <div 
      className={`absolute inset-0 w-full h-full transition-colors duration-1000 ${isInteractive ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ backgroundColor: config.bg }}
    >
      <Canvas 
        shadows 
        dpr={[1, 1.5]} 
        gl={{ antialias: false, powerPreference: "high-performance" }}
        performance={{ min: 0.5 }}
        camera={{ position: [0, 2, 18], fov: 45 }}
      >
        <fog attach="fog" args={[config.fogColor, config.fogNear, config.fogFar]} />
        
        {/* Lighting Setup for "Warm & Moonlit" look */}
        <ambientLight intensity={config.ambientIntensity} />
        
        {/* Moonlight (Cool Blue) */}
        <directionalLight 
          position={config.sunPosition} 
          intensity={config.sunIntensity} 
          color={config.sunColor} 
          castShadow 
          shadow-bias={-0.0001}
          shadow-mapSize={[512, 512]}
        />
        
        {/* Warm Fill from Tree Lights */}
        <pointLight position={[2, 4, 2]} intensity={1} color={config.fillLightColor} distance={10} />
        <pointLight position={[-2, 2, 3]} intensity={1} color={config.fillLightColor} distance={10} />
        {/* Central Tree Glow (compensating for removed individual lights) */}
        <pointLight position={[0, 3, 0]} intensity={2} color="#ffaa00" distance={8} decay={2} />

        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
              <Trunk />
              <RealisticFoliage />
              <FairyLights />
              <Ornaments />
              
              {/* Celestial Body */}
              {/* Celestial Body */}
              {config.celestialBody === 'moon' ? (
                <Moon intensity={config.moonGlow} />
              ) : (
                <group position={config.sunPosition}>
                   <Sun />
                </group>
              )}

              <Ground />
              <Gifts />
              <LightStrips />
{/* <Monkey 
                position={[2, 0, 2]} 
                scale={[0.5, 0.5, 0.5]} 
                treeHeight={7}
                treeRadius={2.5}
              /> */}
              {/* Snow System (Conditional) */}
              {isSnowing && (
                <Snow 
                    speed={snowSpeed} 
                    windX={windX}
                    turbulence={turbulence}
                    size={snowflakeSize}
                />
              )}
              
              {/* New Constellations */}
              {config.starOpacity > 0.5 && <Constellations />}
          </group>
        </Suspense>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        
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
            <Bloom luminanceThreshold={config.bloomThreshold} mipmapBlur intensity={config.bloomIntensity} radius={0.4} />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
