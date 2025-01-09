import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AudioAnalyzer } from './AudioAnalyzer';
import { shapes, ShapePoint } from './shapes';

interface ParticleSystemProps {
  count: number;
  audioAnalyzer: AudioAnalyzer;
}

export function ParticleSystem({ count, audioAnalyzer }: ParticleSystemProps) {
  const points = useRef<THREE.Points>(null);
  const currentShape = useRef(0);
  const transitionSpeed = useRef(0.1);

  const shapeGenerators = useMemo(() => [
    () => shapes.sphere(2),
    () => shapes.cube(3),
    () => shapes.spiral(2),
    () => shapes.tornado(2),
    () => shapes.grid(count),
  ], [count]);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const { x, y, z } = shapeGenerators[0]();
      temp[i3] = x;
      temp[i3 + 1] = y;
      temp[i3 + 2] = z;
    }
    return temp;
  }, [count, shapeGenerators]);

  const targetPositions = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const { x, y, z } = shapeGenerators[1]();
      temp[i3] = x;
      temp[i3 + 1] = y;
      temp[i3 + 2] = z;
    }
    return temp;
  }, [count, shapeGenerators]);

  useFrame((state) => {
    if (!points.current) return;

    const time = state.clock.getElapsedTime();
    const positions = points.current.geometry.attributes.position.array as Float32Array;
    const beatIntensity = audioAnalyzer.getBeatIntensity();

    // Change shape on strong beats
    if (beatIntensity > 0.8) {
      currentShape.current = (currentShape.current + 1) % shapeGenerators.length;
      const nextShape = shapeGenerators[currentShape.current];

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const { x, y, z } = nextShape();
        targetPositions[i3] = x;
        targetPositions[i3 + 1] = y;
        targetPositions[i3 + 2] = z;
      }

      transitionSpeed.current = 0.2; // Faster transitions on beats
    }


    const speed = transitionSpeed.current * (1 + beatIntensity * 2);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      positions[i3] += (targetPositions[i3] - positions[i3]) * speed;
      positions[i3 + 1] += (targetPositions[i3 + 1] - positions[i3 + 1]) * speed;
      positions[i3 + 2] += (targetPositions[i3 + 2] - positions[i3 + 2]) * speed;

      // todo : for wave effects
      const wave = Math.sin(time * 2 + positions[i3 + 1]) * 0.1 * beatIntensity;
      positions[i3] += wave;
      positions[i3 + 2] += wave;
    }

    points.current.geometry.attributes.position.needsUpdate = true;

    points.current.rotation.y = time * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={new THREE.Color("#00ff88")}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}
