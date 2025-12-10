'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import GUI from 'lil-gui';

/**
 * ChristmasScene Component - V5 (Responsive Layout Engine)
 * 
 * Features:
 * 1. "Contain" Fit Logic: Ensures the tree is fully visible regardless of screen size.
 * 2. Dynamic Anchor: Anchors the tree to the bottom of the visual viewport.
 * 3. 3D Volumetric Displacement (Preserved).
 * 4. Atmospheric Lighting (Preserved).
 */
export const ChristmasScene: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const NEW_IMAGE_URL = 'https://cdn.jsdelivr.net/gh/goldfishinsky/pics/img/IMG_2613.jpg';

        // --- SCENE ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#020202');

        const width = window.innerWidth;
        const height = window.innerHeight;

        // CAMERA
        const fov = 50;
        const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);
        // Default position, will act as reference for 'distance' calculation
        // We put camera at Z=3 to have a standard depth field
        camera.position.set(0, 0, 3.0);
        camera.lookAt(0, 0, 0); // Look center for now, we move the object relative to cam

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // --- PARAMS ---
        const params = {
            displacement: 1.0,
            pointSize: 4.5, // Increased size
            warmthIntensity: 1.3,
            moonIntensity: 0.5,
            brightness: 1.6, // Boosted brightness
            twinkleSpeed: 5.0
        };

        const gui = new GUI({ title: 'Brilliance Control' });
        gui.domElement.style.zIndex = '1000';

        // --- OBJECT ---
        // Base geometry, unit size 1x1. We will scale this mesh.
        const geometry = new THREE.PlaneGeometry(1, 1, 350, 450);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: null },
                uTime: { value: 0 },
                uDisplacement: { value: params.displacement },
                uPointSize: { value: params.pointSize },
                uWarmth: { value: params.warmthIntensity },
                uMoon: { value: params.moonIntensity },
                uBrightness: { value: params.brightness },
                uTwinkleSpeed: { value: params.twinkleSpeed },
                uMouse: { value: new THREE.Vector3(0.5, 0.5, 0) }
            },
            vertexShader: `
                uniform sampler2D uTexture;
                uniform float uDisplacement;
                uniform float uPointSize;
                uniform float uTime;
                
                varying vec2 vUv;
                varying float vLum; 

                void main() {
                    vUv = uv;
                    vec4 color = texture2D(uTexture, uv);
                    float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                    vLum = lum;
                    
                    vec3 pos = position;
                    
                    // LUMINANCE DISPLACEMENT
                    pos.z += lum * uDisplacement;
                    
                    // CURVATURE
                    pos.z -= pow(abs(pos.x), 2.0) * 0.2;
                    
                    // IDLE MOTION
                    pos.z += sin(uTime * 0.5 + pos.y * 2.0) * 0.05;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    
                    // Size attenuation
                    gl_PointSize = uPointSize * (3.0 / -gl_Position.z);
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform float uWarmth;
                uniform float uMoon;
                uniform float uBrightness;
                uniform float uTwinkleSpeed;
                uniform float uTime;
                
                varying vec2 vUv;
                varying float vLum;

                // Simple pseudo-random
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                void main() {
                    vec4 color = texture2D(uTexture, vUv);
                    
                    // 1. TWINKLE EFFECT (The "Brilliance")
                    // Calculate a random offset for each pixel so they twinkle independently
                    float rand = random(vUv);
                    float twinkle = 0.5 + 0.5 * sin(uTime * uTwinkleSpeed + rand * 100.0);
                    
                    // Only apply intense twinkle to bright areas (lights)
                    // The brighter the pixel, the more it creates a "Sparkle"
                    if (vLum > 0.6) {
                        color.rgb += vec3(twinkle) * 0.8;
                    }

                    // 2. Warm Core (Gold/Amber)
                    vec3 warm = vec3(1.0, 0.8, 0.2); // Richer Gold
                    color.rgb = mix(color.rgb, warm, vLum * uWarmth * 0.8);
                    
                    // 3. Moon Rim (Subtle Cool)
                    vec3 cool = vec3(0.2, 0.5, 1.0);
                    color.rgb += cool * uMoon * (1.0 - vUv.x) * vUv.y;
                    
                    // 4. Brightness
                    color.rgb *= uBrightness;

                    // 5. Alpha Cutoff
                    if (vLum < 0.05) discard;
                    
                    gl_FragColor = vec4(color.rgb, 1.0);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const mesh = new THREE.Points(geometry, material);
        // Initial Pivot Adjustment:
        // By default Plane geometry center is (0,0). 
        // We want to scale/position it easily, so let's just move it.
        scene.add(mesh);


        // --- LAYOUT ENGINE ---
        let imgAspect = 1.0;

        const updateLayout = () => {
            if (!material.uniforms.uTexture.value) return;

            // 1. Calculate Frustum Size at Object Depth (Z=0)
            // Camera Z = 3. Object Z = 0. Dist = 3.
            const dist = camera.position.z - mesh.position.z;
            const vFov = THREE.MathUtils.degToRad(camera.fov);
            const visibleHeight = 2 * Math.tan(vFov / 2) * dist;
            const visibleWidth = visibleHeight * camera.aspect;

            // 2. Determine Scale to Fit
            // Goal: Fill ~80% of the screen height, OR ~80% of screen width (whichever is smaller)
            const padding = 0.85;

            // Calculate potential Height if width constrained
            // w = h * imgAspect -> h = w / imgAspect

            let targetHeight = visibleHeight * padding;
            let targetWidth = targetHeight * imgAspect;

            if (targetWidth > visibleWidth * padding) {
                // Too wide, constrain by width
                targetWidth = visibleWidth * padding;
                targetHeight = targetWidth / imgAspect;
            }

            mesh.scale.set(targetWidth, targetHeight, 1);

            // 3. Position: Anchor Bottom
            // Screen Bottom Y = -visibleHeight / 2
            // Mesh Bottom Y = currentY - (targetHeight / 2)
            // We want Mesh Bottom Y = Screen Bottom Y + nice_margin

            const screenBottom = -visibleHeight / 2;
            const meshCenterY = screenBottom + (targetHeight / 2) + (visibleHeight * 0.05); // +5% padding

            mesh.position.y = meshCenterY;
            mesh.rotation.x = -0.15; // Still tilt back slightly for 3D effect
        };

        // --- LOAD ---
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');

        textureLoader.load(NEW_IMAGE_URL, (tex) => {
            imgAspect = tex.image.width / tex.image.height;
            material.uniforms.uTexture.value = tex;
            material.needsUpdate = true;
            updateLayout();
        });

        // --- LOOPS ---
        const clock = new THREE.Clock();
        const animate = () => {
            const time = clock.getElapsedTime();
            material.uniforms.uTime.value = time;
            // Scan rotation
            mesh.rotation.y = Math.sin(time * 0.2) * 0.1;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            updateLayout(); // Re-calc fit
        };
        window.addEventListener('resize', handleResize);

        // GUI
        gui.add(params, 'displacement', 0, 3).onChange(v => material.uniforms.uDisplacement.value = v);
        gui.add(params, 'pointSize', 1, 10).onChange(v => material.uniforms.uPointSize.value = v);
        gui.add(params, 'warmthIntensity', 0, 2).onChange(v => material.uniforms.uWarmth.value = v);

        return () => {
            gui.destroy();
            window.removeEventListener('resize', handleResize);
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return <div ref={mountRef} className="absolute inset-0 w-full h-full bg-black/95" />;
};
