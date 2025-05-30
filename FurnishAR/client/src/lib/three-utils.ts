import { Vector3, Euler, Color } from 'three';
import * as THREE from 'three';

// Color options for furniture customization
export const FURNITURE_COLORS = [
  { name: 'Warm Grey', value: '#8B7355' },
  { name: 'Ocean Blue', value: '#2563EB' },
  { name: 'Burnt Sienna', value: '#A0522D' },
  { name: 'Ivory', value: '#FFFFF0' },
  { name: 'Jet Black', value: '#343434' },
];

// Texture options for furniture customization
export const FURNITURE_TEXTURES = [
  { name: 'Wood', value: 'wood' },
  { name: 'Matte', value: 'matte' },
  { name: 'Marble', value: 'marble' },
  { name: 'Metal', value: 'metal' },
  { name: 'Fabric', value: 'fabric' },
];

// Convert 2D room coordinates to 3D world coordinates
export const convert2DTo3D = (x: number, y: number, roomWidth: number, roomHeight: number): Vector3 => {
  // Normalize coordinates from SVG space to world space
  const worldX = (x - 200) / 10; // Center around origin, scale down
  const worldZ = (y - 150) / 10; // Center around origin, scale down
  return new Vector3(worldX, 0, worldZ);
};

// Convert 3D world coordinates back to 2D room coordinates
export const convert3DTo2D = (position: Vector3, roomWidth: number, roomHeight: number): { x: number; y: number } => {
  const x = position.x * 10 + 200; // Scale up and offset
  const y = position.z * 10 + 150; // Scale up and offset
  return { x, y };
};

// Generate room geometry from polygon points
export const generateRoomGeometry = (points: { x: number; y: number }[]) => {
  const shape = new THREE.Shape();
  
  if (points.length > 0) {
    const firstPoint = convert2DTo3D(points[0].x, points[0].y, 400, 300);
    shape.moveTo(firstPoint.x, firstPoint.z);
    
    for (let i = 1; i < points.length; i++) {
      const point = convert2DTo3D(points[i].x, points[i].y, 400, 300);
      shape.lineTo(point.x, point.z);
    }
    
    shape.lineTo(firstPoint.x, firstPoint.z); // Close the shape
  }
  
  return shape;
};

// Calculate room bounds from polygon points
export const calculateRoomBounds = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;
  
  points.forEach(point => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });
  
  return { minX, maxX, minY, maxY };
};

// Snap position to grid
export const snapToGrid = (position: Vector3, gridSize: number = 0.5): Vector3 => {
  return new Vector3(
    Math.round(position.x / gridSize) * gridSize,
    position.y,
    Math.round(position.z / gridSize) * gridSize
  );
};

// Check if position is within room bounds
export const isPositionInRoom = (position: Vector3, roomPoints: { x: number; y: number }[]): boolean => {
  const bounds = calculateRoomBounds(roomPoints);
  const worldPos = convert3DTo2D(position, 400, 300);
  
  return worldPos.x >= bounds.minX && 
         worldPos.x <= bounds.maxX && 
         worldPos.y >= bounds.minY && 
         worldPos.y <= bounds.maxY;
};

// Generate default furniture placement for room type
export const getDefaultFurnitureForRoom = (roomType: string): any[] => {
  const defaults: Record<string, any[]> = {
    bedroom: [
      {
        category: 'beds',
        modelId: 1,
        position: { x: 0, y: 0, z: -2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        category: 'tables',
        modelId: 8,
        position: { x: 3, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 0.8, z: 0.8 },
      },
    ],
    'living room': [
      {
        category: 'sofas',
        modelId: 6,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        category: 'tables',
        modelId: 12,
        position: { x: 0, y: 0, z: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
      },
    ],
    kitchen: [
      {
        category: 'dining',
        modelId: 26,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    ],
  };
  
  return defaults[roomType.toLowerCase()] || [];
};

// Apply material to furniture
export const applyFurnitureMaterial = (object: any, color: string, texture: string) => {
  if (!object) return;
  
  const colorObj = new Color(color);
  
  object.traverse((child: any) => {
    if (child.isMesh && child.material) {
      child.material.color = colorObj;
      
      // Apply texture-specific properties
      switch (texture) {
        case 'wood':
          child.material.roughness = 0.8;
          child.material.metalness = 0.1;
          break;
        case 'matte':
          child.material.roughness = 1.0;
          child.material.metalness = 0.0;
          break;
        case 'marble':
          child.material.roughness = 0.1;
          child.material.metalness = 0.1;
          break;
        case 'metal':
          child.material.roughness = 0.2;
          child.material.metalness = 0.9;
          break;
        case 'fabric':
          child.material.roughness = 0.9;
          child.material.metalness = 0.0;
          break;
      }
    }
  });
};
