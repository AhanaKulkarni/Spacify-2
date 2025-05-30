export interface Material {
  id: string;
  name: string;
  color: string;
  textureType: 'wood' | 'marble' | 'fabric' | 'metal' | 'matte';
}

export const materials: Material[] = [
  // Wood textures
  { id: 'oak-wood', name: 'Oak Wood', color: '#8B4513', textureType: 'wood' },
  { id: 'walnut-wood', name: 'Walnut Wood', color: '#654321', textureType: 'wood' },
  { id: 'pine-wood', name: 'Pine Wood', color: '#DEB887', textureType: 'wood' },
  
  // Marble textures
  { id: 'white-marble', name: 'White Marble', color: '#F8F8FF', textureType: 'marble' },
  { id: 'black-marble', name: 'Black Marble', color: '#2F2F2F', textureType: 'marble' },
  { id: 'green-marble', name: 'Green Marble', color: '#228B22', textureType: 'marble' },
  
  // Fabric textures
  { id: 'cotton-fabric', name: 'Cotton Fabric', color: '#F5F5DC', textureType: 'fabric' },
  { id: 'velvet-fabric', name: 'Velvet Fabric', color: '#8B008B', textureType: 'fabric' },
  { id: 'linen-fabric', name: 'Linen Fabric', color: '#FAF0E6', textureType: 'fabric' },
  
  // Metal textures
  { id: 'steel-metal', name: 'Steel Metal', color: '#C0C0C0', textureType: 'metal' },
  { id: 'brass-metal', name: 'Brass Metal', color: '#B5651D', textureType: 'metal' },
  { id: 'copper-metal', name: 'Copper Metal', color: '#B87333', textureType: 'metal' },
  
  // Matte textures
  { id: 'matte-white', name: 'Matte White', color: '#FFFFFF', textureType: 'matte' },
  { id: 'matte-black', name: 'Matte Black', color: '#000000', textureType: 'matte' },
  { id: 'matte-gray', name: 'Matte Gray', color: '#808080', textureType: 'matte' },
];

export const colors = [
  { id: 'warm-gray', name: 'Warm Gray', value: '#8B8680' },
  { id: 'ocean-blue', name: 'Ocean Blue', value: '#006994' },
  { id: 'burnt-sienna', name: 'Burnt Sienna', value: '#E97451' },
  { id: 'ivory', name: 'Ivory', value: '#FFFFF0' },
  { id: 'jet-black', name: 'Jet Black', value: '#343434' },
];

export const textures = [
  { id: 'wood', name: 'Wood', description: 'Natural wood grain' },
  { id: 'matte', name: 'Matte White', description: 'Smooth matte finish' },
  { id: 'marble', name: 'Glossy Marble', description: 'Polished marble surface' },
  { id: 'granite', name: 'Granite', description: 'Textured granite finish' },
  { id: 'fabric', name: 'Fabric', description: 'Soft fabric upholstery' },
];
