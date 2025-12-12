import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type MonkeyState = 'IDLE' | 'ROAMING_GROUND' | 'CLIMBING_TREE' | 'JUMPING';

interface MonkeyProps {
  treeHeight?: number;
  treeRadius?: number;
  [key: string]: any;
}

export const Monkey = ({ treeHeight = 7, treeRadius = 2.5, ...props }: MonkeyProps) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/monkey.glb');
  const { actions } = useAnimations(animations, group);

  // Bones
  const headRef = useRef<THREE.Bone | null>(null);
  const spineRef = useRef<THREE.Bone | null>(null);
  const hipsRef = useRef<THREE.Bone | null>(null);
  
  // Limb Refs
  const armLRef = useRef<THREE.Bone | null>(null);
  const armRRef = useRef<THREE.Bone | null>(null);
  const legLRef = useRef<THREE.Bone | null>(null);
  const legRRef = useRef<THREE.Bone | null>(null);

  // State Machine
  const [currentState, setCurrentState] = useState<MonkeyState>('IDLE');
  const targetPosition = useRef(new THREE.Vector3(2, 0, 2));
  const stateTimer = useRef(0);
  
  // Movement Params
  const speed = 2.5;
  const climbSpeed = 1.5;

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Bone).isBone) {
        const name = child.name.toLowerCase();
        // Core
        if (name.includes('head')) headRef.current = child as THREE.Bone;
        if (name.includes('spine') || name.includes('body')) spineRef.current = child as THREE.Bone;
        if (name.includes('hip') || name.includes('root') || name.includes('pelvis')) hipsRef.current = child as THREE.Bone;
        
        // Limbs - Simple fuzzy matching
        // Assumes names like "Arm_L", "LeftArm", "Thigh.R", etc.
        const isLeft = name.includes('l') && !name.includes('r') || name.includes('left');
        const isRight = name.includes('r') && !name.includes('l') || name.includes('right');
        
        if (name.includes('arm') || name.includes('shoulder')) {
            if (isLeft) armLRef.current = child as THREE.Bone;
            if (isRight) armRRef.current = child as THREE.Bone;
        }
        if (name.includes('leg') || name.includes('thigh') || name.includes('up_leg')) {
            if (isLeft) legLRef.current = child as THREE.Bone;
            if (isRight) legRRef.current = child as THREE.Bone;
        }
      }
    });
  }, [scene]);

  const pickRandomGroundPoint = () => {
    const r = 3 + Math.random() * 5; // 3 to 8 radius
    const angle = Math.random() * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r);
  };

  const pickRandomTreePoint = () => {
    const h = Math.random() * (treeHeight * 0.8) + 0.5; // 0.5 to 80% height
    const r = (1 - h / treeHeight) * treeRadius; // Cone radius at height
    const angle = Math.random() * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle) * r, h, Math.sin(angle) * r);
  };

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();

    // --- State Logic ---
    stateTimer.current -= delta;

    if (stateTimer.current <= 0) {
      // Decision time!
      const rand = Math.random();
      
      if (currentState === 'IDLE') {
        // From Idle -> Roam (70%) or Climb (30%)
        if (rand < 0.7) {
            setCurrentState('ROAMING_GROUND');
            targetPosition.current = pickRandomGroundPoint();
            stateTimer.current = 10; // Max roam time
        } else {
            setCurrentState('CLIMBING_TREE');
            targetPosition.current = pickRandomTreePoint();
            stateTimer.current = 10;
        }
      } else if (currentState === 'ROAMING_GROUND') {
        // Arrived or tired -> Idle (50%) or Climb (50%)
        if (rand < 0.5) {
            setCurrentState('IDLE');
            stateTimer.current = 2 + Math.random() * 3;
        } else {
            setCurrentState('CLIMBING_TREE');
            targetPosition.current = pickRandomTreePoint();
            stateTimer.current = 10;
        }
      } else if (currentState === 'CLIMBING_TREE') {
         // Arrived or tired -> Idle on tree? No, mostly go back to ground or new tree spot
         if (rand < 0.6) {
             // Move to new tree spot
             targetPosition.current = pickRandomTreePoint();
             stateTimer.current = 10;
         } else {
             // Jump down
             setCurrentState('ROAMING_GROUND');
             targetPosition.current = pickRandomGroundPoint();
             stateTimer.current = 10;
         }
      }
    }

    // --- Movement Logic ---
    const currentPos = group.current.position.clone();
    const dist = currentPos.distanceTo(targetPosition.current);
    
    // Check arrival
    if (dist < 0.2 && currentState !== 'IDLE') {
        stateTimer.current = 0; // Force new decision
    }

    if (currentState === 'ROAMING_GROUND') {
        // Move towards target
        const dir = targetPosition.current.clone().sub(currentPos).normalize();
        group.current.position.add(dir.multiplyScalar(speed * delta));
        
        // Look at target
        const lookTarget = targetPosition.current.clone();
        lookTarget.y = currentPos.y; // Keep looking horizontal
        group.current.lookAt(lookTarget);

        // Walk Cycle (Bobbing + Rocking)
        group.current.position.y = Math.abs(Math.sin(t * 10)) * 0.1; 
        group.current.rotation.z = Math.sin(t * 10) * 0.05; // Rocking
        
    } else if (currentState === 'CLIMBING_TREE') {
        // Move towards target (3D)
        const dir = targetPosition.current.clone().sub(currentPos).normalize();
        group.current.position.add(dir.multiplyScalar(climbSpeed * delta));
        
        // Re-project to cone surface to prevent clipping
        const currentH = group.current.position.y;
        const idealR = (1 - currentH / treeHeight) * treeRadius;
        
        // Get horizontal distance from center
        const horizontalDist = Math.sqrt(group.current.position.x ** 2 + group.current.position.z ** 2);
        
        if (horizontalDist > 0) {
            const scale = idealR / horizontalDist;
            group.current.position.x *= scale;
            group.current.position.z *= scale;
        }

        // Orientation: Face the tree trunk
        const center = new THREE.Vector3(0, currentPos.y, 0);
        group.current.lookAt(center);
        
        // Climbing Bob
        // group.current.position.y += Math.sin(t * 15) * 0.005; 
    }


    // --- Procedural Animation (Overlay) ---
    
    // 1. Breathing (Spine) - Always active
    if (spineRef.current) {
        spineRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02);
        spineRef.current.rotation.x = Math.sin(t * 1.5) * 0.05;
    }

    // 2. Limb Animation (Fake IK)
    if (currentState === 'ROAMING_GROUND') {
        // Walk Cycle
        const walkSpeed = 10;
        const armAmp = 0.5;
        const legAmp = 0.8;
        
        if (armLRef.current) armLRef.current.rotation.x = Math.sin(t * walkSpeed) * armAmp;
        if (armRRef.current) armRRef.current.rotation.x = Math.sin(t * walkSpeed + Math.PI) * armAmp;
        
        // Cross-crawl: Left Arm matches Right Leg
        if (legLRef.current) legLRef.current.rotation.x = Math.sin(t * walkSpeed + Math.PI) * legAmp;
        if (legRRef.current) legRRef.current.rotation.x = Math.sin(t * walkSpeed) * legAmp;
        
    } else if (currentState === 'CLIMBING_TREE') {
        // Climb Cycle
        const climbCycle = 8;
        const armAmp = 0.6;
        const legAmp = 0.6;
        
        // Reaching up and pulling down
        if (armLRef.current) armLRef.current.rotation.x = -1.5 + Math.sin(t * climbCycle) * armAmp; // Offset to reach up
        if (armRRef.current) armRRef.current.rotation.x = -1.5 + Math.sin(t * climbCycle + Math.PI) * armAmp;
        
        if (legLRef.current) legLRef.current.rotation.x = Math.sin(t * climbCycle + Math.PI) * legAmp;
        if (legRRef.current) legRRef.current.rotation.x = Math.sin(t * climbCycle) * legAmp;
    } else {
        // Reset limbs to neutral when idle
        const damp = 5;
        if (armLRef.current) armLRef.current.rotation.x = THREE.MathUtils.damp(armLRef.current.rotation.x, 0, damp, delta);
        if (armRRef.current) armRRef.current.rotation.x = THREE.MathUtils.damp(armRRef.current.rotation.x, 0, damp, delta);
        if (legLRef.current) legLRef.current.rotation.x = THREE.MathUtils.damp(legLRef.current.rotation.x, 0, damp, delta);
        if (legRRef.current) legRRef.current.rotation.x = THREE.MathUtils.damp(legRRef.current.rotation.x, 0, damp, delta);
    }

    // 3. Head Tracking
    if (headRef.current) {
        // Look forward if moving, look around if idle
        if (currentState === 'IDLE') {
             // Randomly change interest point (from previous code)
            if (Math.random() < 0.01) {
                const yaw = (Math.random() - 0.5) * 1.5;
                const pitch = (Math.random() - 0.5) * 0.5;
                headRef.current.userData.targetYaw = yaw;
                headRef.current.userData.targetPitch = pitch;
            }
            const targetYaw = headRef.current.userData.targetYaw || 0;
            const targetPitch = headRef.current.userData.targetPitch || 0;
            const lambda = 3; 
            headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, targetYaw, lambda, delta);
            headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, targetPitch, lambda, delta);
        } else if (currentState === 'CLIMBING_TREE') {
            // Look up/down towards target
            // For now, just look up slightly
            headRef.current.rotation.x = -0.5; 
        } else {
            // Reset head to look forward when moving
             const lambda = 5;
             headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, 0, lambda, delta);
             headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, 0, lambda, delta);
        }
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/monkey.glb');
