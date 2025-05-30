export interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  thumbnailUrl: string;
  modelUrl: string;
  isDefault: boolean;
  price: number;
}

export const furnitureCategories = [
  { id: 'beds', name: 'Beds' },
  { id: 'sofas', name: 'Sofas' },
  { id: 'chairs', name: 'Chairs' },
  { id: 'tables', name: 'Tables' },
  { id: 'wall-decor', name: 'Wall Decor' },
  { id: 'dining', name: 'Dining' },
  { id: 'cutlery', name: 'Cutlery' }
];

export const textures = [
  { id: 'wood', name: 'Wood', preview: '#D2691E' },
  { id: 'matte', name: 'Matte White', preview: '#F5F5F5' },
  { id: 'marble', name: 'Marble', preview: '#F8F8FF' },
  { id: 'granite', name: 'Granite', preview: '#696969' },
  { id: 'fabric', name: 'Fabric', preview: '#DDA0DD' },
];

export const colors = [
  { id: 'warm-grey', name: 'Warm Grey', hex: '#8E8E93' },
  { id: 'ocean-blue', name: 'Ocean Blue', hex: '#007AFF' },
  { id: 'burnt-sienna', name: 'Burnt Sienna', hex: '#A0522D' },
  { id: 'ivory', name: 'Ivory', hex: '#FFFFF0' },
  { id: 'jet-black', name: 'Jet Black', hex: '#343A40' },
];

// Default furniture models (35 total - 5 per category)
export const defaultFurnitureModels: FurnitureItem[] = [
  // Beds (5)
  {
    id: 'bed-platform',
    name: 'Platform Bed',
    category: 'beds',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/beds/platform-bed.glb',
    isDefault: true,
    price: 1299,
  },
  {
    id: 'bed-upholstered',
    name: 'Upholstered Bed',
    category: 'beds',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/beds/upholstered-bed.glb',
    isDefault: true,
    price: 1599,
  },
  {
    id: 'bed-storage',
    name: 'Storage Bed',
    category: 'beds',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/beds/storage-bed.glb',
    isDefault: true,
    price: 1899,
  },
  {
    id: 'bed-canopy',
    name: 'Canopy Bed',
    category: 'beds',
    thumbnailUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/beds/canopy-bed.glb',
    isDefault: true,
    price: 2299,
  },
  {
    id: 'bed-modern',
    name: 'Modern Bed',
    category: 'beds',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/beds/modern-bed.glb',
    isDefault: true,
    price: 1799,
  },
  
  // Sofas (5)
  {
    id: 'sofa-sectional',
    name: 'L-Sectional',
    category: 'sofas',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/sofas/l-sectional.glb',
    isDefault: true,
    price: 2499,
  },
  {
    id: 'sofa-modern',
    name: 'Modern Sofa',
    category: 'sofas',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/sofas/modern-sofa.glb',
    isDefault: true,
    price: 1899,
  },
  {
    id: 'sofa-chesterfield',
    name: 'Chesterfield',
    category: 'sofas',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/sofas/chesterfield.glb',
    isDefault: true,
    price: 2899,
  },
  {
    id: 'sofa-loveseat',
    name: 'Loveseat',
    category: 'sofas',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/sofas/loveseat.glb',
    isDefault: true,
    price: 1299,
  },
  {
    id: 'sofa-recliner',
    name: 'Recliner Sofa',
    category: 'sofas',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/sofas/recliner-sofa.glb',
    isDefault: true,
    price: 2199,
  },

  // Chairs (5)
  {
    id: 'chair-accent',
    name: 'Accent Chair',
    category: 'chairs',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/chairs/accent-chair.glb',
    isDefault: true,
    price: 699,
  },
  {
    id: 'chair-office',
    name: 'Office Chair',
    category: 'chairs',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/chairs/office-chair.glb',
    isDefault: true,
    price: 899,
  },
  {
    id: 'chair-dining',
    name: 'Dining Chair',
    category: 'chairs',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/chairs/dining-chair.glb',
    isDefault: true,
    price: 299,
  },
  {
    id: 'chair-armchair',
    name: 'Armchair',
    category: 'chairs',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/chairs/armchair.glb',
    isDefault: true,
    price: 1199,
  },
  {
    id: 'chair-lounge',
    name: 'Lounge Chair',
    category: 'chairs',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/chairs/lounge-chair.glb',
    isDefault: true,
    price: 1599,
  },

  // Tables (5)
  {
    id: 'table-dining',
    name: 'Dining Table',
    category: 'tables',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/tables/dining-table.glb',
    isDefault: true,
    price: 1299,
  },
  {
    id: 'table-coffee',
    name: 'Coffee Table',
    category: 'tables',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/tables/coffee-table.glb',
    isDefault: true,
    price: 699,
  },
  {
    id: 'table-side',
    name: 'Side Table',
    category: 'tables',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/tables/side-table.glb',
    isDefault: true,
    price: 399,
  },
  {
    id: 'table-console',
    name: 'Console Table',
    category: 'tables',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/tables/console-table.glb',
    isDefault: true,
    price: 899,
  },
  {
    id: 'table-desk',
    name: 'Desk',
    category: 'tables',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/tables/desk.glb',
    isDefault: true,
    price: 1199,
  },

  // Wall Decor (5)
  {
    id: 'wall-mirror',
    name: 'Wall Mirror',
    category: 'wall-decor',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/wall-decor/wall-mirror.glb',
    isDefault: true,
    price: 299,
  },
  {
    id: 'wall-art',
    name: 'Wall Art',
    category: 'wall-decor',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/wall-decor/wall-art.glb',
    isDefault: true,
    price: 199,
  },
  {
    id: 'wall-shelf',
    name: 'Wall Shelf',
    category: 'wall-decor',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/wall-decor/wall-shelf.glb',
    isDefault: true,
    price: 149,
  },
  {
    id: 'wall-clock',
    name: 'Wall Clock',
    category: 'wall-decor',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/wall-decor/wall-clock.glb',
    isDefault: true,
    price: 99,
  },
  {
    id: 'wall-sconce',
    name: 'Wall Sconce',
    category: 'wall-decor',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/wall-decor/wall-sconce.glb',
    isDefault: true,
    price: 179,
  },

  // Dining (5)
  {
    id: 'dining-set',
    name: 'Dining Set',
    category: 'dining',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/dining/dining-set.glb',
    isDefault: true,
    price: 2499,
  },
  {
    id: 'dining-buffet',
    name: 'Buffet',
    category: 'dining',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/dining/buffet.glb',
    isDefault: true,
    price: 1799,
  },
  {
    id: 'dining-cabinet',
    name: 'China Cabinet',
    category: 'dining',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/dining/china-cabinet.glb',
    isDefault: true,
    price: 1299,
  },
  {
    id: 'dining-bar',
    name: 'Bar Cart',
    category: 'dining',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/dining/bar-cart.glb',
    isDefault: true,
    price: 699,
  },
  {
    id: 'dining-bench',
    name: 'Dining Bench',
    category: 'dining',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/dining/dining-bench.glb',
    isDefault: true,
    price: 499,
  },

  // Cutlery (5)
  {
    id: 'cutlery-set',
    name: 'Cutlery Set',
    category: 'cutlery',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/cutlery/cutlery-set.glb',
    isDefault: true,
    price: 199,
  },
  {
    id: 'cutlery-knife-block',
    name: 'Knife Block',
    category: 'cutlery',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/cutlery/knife-block.glb',
    isDefault: true,
    price: 129,
  },
  {
    id: 'cutlery-utensil-holder',
    name: 'Utensil Holder',
    category: 'cutlery',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/cutlery/utensil-holder.glb',
    isDefault: true,
    price: 49,
  },
  {
    id: 'cutlery-serving-set',
    name: 'Serving Set',
    category: 'cutlery',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/cutlery/serving-set.glb',
    isDefault: true,
    price: 89,
  },
  {
    id: 'cutlery-spice-rack',
    name: 'Spice Rack',
    category: 'cutlery',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    modelUrl: '/models/cutlery/spice-rack.glb',
    isDefault: true,
    price: 79,
  },
];

// Alias for backward compatibility
export const furnitureLibrary = defaultFurnitureModels;