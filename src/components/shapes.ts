import { Vector3 } from 'three';

export interface ShapePoint {
  x: number;
  y: number;
  z: number;
}

export const shapes = {
  sphere: (r: number): ShapePoint => {
    const phi = Math.random() * Math.PI * 2;
    const costheta = Math.random() * 2 - 1;
    const u = Math.random();
    const theta = Math.acos(costheta);
    const r_rand = r * Math.cbrt(u);
    return {
      x: r_rand * Math.sin(theta) * Math.cos(phi),
      y: r_rand * Math.sin(theta) * Math.sin(phi),
      z: r_rand * Math.cos(theta),
    };
  },

  cube: (s: number): ShapePoint => ({
    x: (Math.random() - 0.5) * s,
    y: (Math.random() - 0.5) * s,
    z: (Math.random() - 0.5) * s,
  }),

  spiral: (r: number): ShapePoint => {
    const t = Math.random() * Math.PI * 2 * 3; // 3 turns
    const height = (Math.random() - 0.5) * 4;
    return {
      x: r * Math.cos(t),
      y: height,
      z: r * Math.sin(t),
    };
  },

  tornado: (r: number): ShapePoint => {
    const t = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 4;
    const radius = r * (1 - Math.abs(height) / 4); // Narrow at top and bottom
    return {
      x: radius * Math.cos(t),
      y: height,
      z: radius * Math.sin(t),
    };
  },

  grid: (s: number): ShapePoint => {
    const gridSize = Math.floor(Math.cbrt(s));
    return {
      x: (Math.floor(Math.random() * gridSize) - gridSize/2) * 0.5,
      y: (Math.floor(Math.random() * gridSize) - gridSize/2) * 0.5,
      z: (Math.floor(Math.random() * gridSize) - gridSize/2) * 0.5,
    };
  }
};