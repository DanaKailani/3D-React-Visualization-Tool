import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import sunTexture from "../textures/2k_sun.jpg"
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import {useRef} from "react";
import { Html } from "@react-three/drei";


export default function Sun({topicName}) {
    // Load Sun texture
    const texture = useLoader(THREE.TextureLoader, sunTexture);
    const sunRef = useRef()

    return (
      <mesh ref = {sunRef} position={[0.1,0,0.1]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial map={texture} />
        <Html distanceFactor={20}>
          <div className="topic" style={{ pointerEvents: 'none'}}>{topicName}</div>
        </Html>
        <EffectComposer autoClear={false}>
          <SelectiveBloom
            selection={sunRef}
            intensity={2.0}
            luminanceThreshold={0.01}
            luminanceSmoothing={0.025}
          />
        </EffectComposer>
      </mesh>
    );
  }