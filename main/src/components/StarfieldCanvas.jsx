import { PointMaterial, Points } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Star configuration constants
const STAR_CONFIG = {
   // Main stars configuration
   MAIN_STARS: {
      count: 2000,
      size: 1.5,
      color: "#ffffff",
      minDistance: 300,
      maxDistance: 1800,
   },

   // Bright stars configuration
   BRIGHT_STARS: {
      count: 100,
      size: 3,
      color: "#87CEEB",
      minDistance: 200,
      maxDistance: 1000,
   },

   // Distant stars configuration
   DISTANT_STARS: {
      count: 500,
      size: 0.8,
      color: "#B0C4DE",
      opacity: 0.6,
      minDistance: 2000,
      maxDistance: 5000,
   },

   // Animation speeds (small values for slow rotation)
   ROTATION_SPEED: {
      x: 0.03,
      y: 0.02,
      z: 0.01,
   },
};

function Stars() {
   const ref = useRef();

   // Generate random star positions with different layers using constants
   const [mainStars, brightStars, distantStars] = useMemo(() => {
      const mainStars = new Float32Array(STAR_CONFIG.MAIN_STARS.count * 3);
      const brightStars = new Float32Array(STAR_CONFIG.BRIGHT_STARS.count * 3);
      const distantStars = new Float32Array(
         STAR_CONFIG.DISTANT_STARS.count * 3
      );

      // Main stars
      for (let i = 0; i < STAR_CONFIG.MAIN_STARS.count; i++) {
         const distance =
            Math.random() *
               (STAR_CONFIG.MAIN_STARS.maxDistance -
                  STAR_CONFIG.MAIN_STARS.minDistance) +
            STAR_CONFIG.MAIN_STARS.minDistance;
         const theta = THREE.MathUtils.randFloatSpread(360);
         const phi = THREE.MathUtils.randFloatSpread(360);

         let x = distance * Math.sin(theta) * Math.cos(phi);
         let y = distance * Math.sin(theta) * Math.sin(phi);
         let z = distance * Math.cos(theta);

         mainStars.set([x, y, z], i * 3);
      }

      // Bright stars
      for (let i = 0; i < STAR_CONFIG.BRIGHT_STARS.count; i++) {
         const distance =
            Math.random() *
               (STAR_CONFIG.BRIGHT_STARS.maxDistance -
                  STAR_CONFIG.BRIGHT_STARS.minDistance) +
            STAR_CONFIG.BRIGHT_STARS.minDistance;
         const theta = THREE.MathUtils.randFloatSpread(360);
         const phi = THREE.MathUtils.randFloatSpread(360);

         let x = distance * Math.sin(theta) * Math.cos(phi);
         let y = distance * Math.sin(theta) * Math.sin(phi);
         let z = distance * Math.cos(theta);

         brightStars.set([x, y, z], i * 3);
      }

      // Distant stars
      for (let i = 0; i < STAR_CONFIG.DISTANT_STARS.count; i++) {
         const distance =
            Math.random() *
               (STAR_CONFIG.DISTANT_STARS.maxDistance -
                  STAR_CONFIG.DISTANT_STARS.minDistance) +
            STAR_CONFIG.DISTANT_STARS.minDistance;
         const theta = THREE.MathUtils.randFloatSpread(360);
         const phi = THREE.MathUtils.randFloatSpread(360);

         let x = distance * Math.sin(theta) * Math.cos(phi);
         let y = distance * Math.sin(theta) * Math.sin(phi);
         let z = distance * Math.cos(theta);

         distantStars.set([x, y, z], i * 3);
      }

      return [mainStars, brightStars, distantStars];
   }, []);

   // Animate rotation with different speeds using constants
   useFrame((state, delta) => {
      if (ref.current) {
         ref.current.rotation.x -= delta * STAR_CONFIG.ROTATION_SPEED.x;
         ref.current.rotation.y -= delta * STAR_CONFIG.ROTATION_SPEED.y;
         ref.current.rotation.z += delta * STAR_CONFIG.ROTATION_SPEED.z;
      }
   });

   return (
      <group ref={ref} rotation={[0, 0, Math.PI / 4]}>
         {/* Main white stars */}
         <Points positions={mainStars} stride={3} frustumCulled={false}>
            <PointMaterial
               transparent
               color={STAR_CONFIG.MAIN_STARS.color}
               size={STAR_CONFIG.MAIN_STARS.size}
               sizeAttenuation={true}
               depthWrite={false}
            />
         </Points>

         {/* Bright pulsing stars */}
         <Points positions={brightStars} stride={3} frustumCulled={false}>
            <PointMaterial
               transparent
               color={STAR_CONFIG.BRIGHT_STARS.color}
               size={STAR_CONFIG.BRIGHT_STARS.size}
               sizeAttenuation={true}
               depthWrite={false}
            />
         </Points>

         {/* Distant dim stars */}
         <Points positions={distantStars} stride={3} frustumCulled={false}>
            <PointMaterial
               transparent
               color={STAR_CONFIG.DISTANT_STARS.color}
               size={STAR_CONFIG.DISTANT_STARS.size}
               sizeAttenuation={true}
               depthWrite={false}
               opacity={STAR_CONFIG.DISTANT_STARS.opacity}
            />
         </Points>
      </group>
   );
}

const StarfieldCanvas = ({ height = "100vh" }) => {
   return (
      <div className="absolute inset-0 w-full" style={{ height, zIndex: 1 }}>
         <Canvas
            camera={{ position: [0, 0, 1], fov: 100 }}
            style={{
               background:
                  "radial-gradient(ellipse at center, #1a1a3e 0%, #0d0d2b 50%, #000000 100%)",
            }}
         >
            {/* Ambient lighting */}
            <ambientLight intensity={0.1} color="#4169E1" />
            <pointLight
               position={[1000, 1000, 1000]}
               intensity={0.3}
               color="#FFD700"
            />
            <pointLight
               position={[-1000, -1000, -1000]}
               intensity={0.2}
               color="#FF69B4"
            />

            {/* All the cosmic elements */}
            <Stars />
         </Canvas>
      </div>
   );
};

export default StarfieldCanvas;
