export const furnitureCategories = [
  { id: "beds", name: "Beds", icon: "🛏️" },
  { id: "sofas", name: "Sofas", icon: "🛋️" },
  { id: "chairs", name: "Chairs", icon: "🪑" },
  { id: "tables", name: "Tables", icon: "🪑" },
  { id: "wall-decor", name: "Wall Decor", icon: "🖼️" },
  { id: "dining", name: "Dining", icon: "🍽️" },
  { id: "cutlery", name: "Cutlery", icon: "🍴" },
];

export const textureOptions = [
  { id: "wood", name: "Wood", color: "#D2691E" },
  { id: "matte", name: "Matte", color: "#F5F5F5" },
  { id: "marble", name: "Marble", color: "#F8F8FF" },
  { id: "metal", name: "Metal", color: "#C0C0C0" },
  { id: "fabric", name: "Fabric", color: "#DDA0DD" },
];

export const colorOptions = [
  { id: "gray", name: "Warm Grey", value: "#8B7355" },
  { id: "blue", name: "Ocean Blue", value: "#006994" },
  { id: "sienna", name: "Burnt Sienna", value: "#A0522D" },
  { id: "ivory", name: "Ivory", value: "#FFFFF0" },
  { id: "black", name: "Jet Black", value: "#343434" },
];

// Mock furniture models with placeholder 3D model paths
export const defaultFurnitureModels = [
  // Beds
  {
    id: 1,
    name: "Platform Bed",
    category: "beds",
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
    modelPath: "/models/platform-bed.glb",
    description: "Modern platform bed with clean lines"
  },
  {
    id: 2,
    name: "Storage Bed",
    category: "beds",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    modelPath: "/models/storage-bed.glb",
    description: "Bed with built-in storage compartments"
  },
  {
    id: 3,
    name: "Upholstered Bed",
    category: "beds",
    thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop",
    modelPath: "/models/upholstered-bed.glb",
    description: "Comfortable upholstered headboard"
  },
  {
    id: 4,
    name: "Wooden Bed",
    category: "beds",
    thumbnail: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=200&h=200&fit=crop",
    modelPath: "/models/wooden-bed.glb",
    description: "Classic wooden bed frame"
  },
  {
    id: 5,
    name: "Modern Bed",
    category: "beds",
    thumbnail: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=200&fit=crop",
    modelPath: "/models/modern-bed.glb",
    description: "Contemporary design bed"
  },

  // Sofas
  {
    id: 6,
    name: "L-Sectional",
    category: "sofas",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    modelPath: "/models/l-sectional.glb",
    description: "Spacious L-shaped sectional sofa"
  },
  {
    id: 7,
    name: "3-Seat Sofa",
    category: "sofas",
    thumbnail: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=200&fit=crop",
    modelPath: "/models/3-seat-sofa.glb",
    description: "Classic three-seater sofa"
  },
  {
    id: 8,
    name: "Loveseat",
    category: "sofas",
    thumbnail: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=200&h=200&fit=crop",
    modelPath: "/models/loveseat.glb",
    description: "Compact two-seater loveseat"
  },
  {
    id: 9,
    name: "Chesterfield",
    category: "sofas",
    thumbnail: "https://images.unsplash.com/photo-1491926626787-62db157af940?w=200&h=200&fit=crop",
    modelPath: "/models/chesterfield.glb",
    description: "Traditional Chesterfield sofa"
  },
  {
    id: 10,
    name: "Modular Sofa",
    category: "sofas",
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
    modelPath: "/models/modular-sofa.glb",
    description: "Configurable modular sofa system"
  },

  // Chairs
  {
    id: 11,
    name: "Office Chair",
    category: "chairs",
    thumbnail: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=200&h=200&fit=crop",
    modelPath: "/models/office-chair.glb",
    description: "Ergonomic office chair"
  },
  {
    id: 12,
    name: "Accent Chair",
    category: "chairs",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    modelPath: "/models/accent-chair.glb",
    description: "Stylish accent chair"
  },
  {
    id: 13,
    name: "Dining Chair",
    category: "chairs",
    thumbnail: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=200&h=200&fit=crop",
    modelPath: "/models/dining-chair.glb",
    description: "Comfortable dining chair"
  },
  {
    id: 14,
    name: "Armchair",
    category: "chairs",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    modelPath: "/models/armchair.glb",
    description: "Classic armchair design"
  },
  {
    id: 15,
    name: "Recliner",
    category: "chairs",
    thumbnail: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=200&fit=crop",
    modelPath: "/models/recliner.glb",
    description: "Comfortable reclining chair"
  },

  // Tables
  {
    id: 16,
    name: "Dining Table",
    category: "tables",
    thumbnail: "https://images.unsplash.com/photo-1549497538-303791108f95?w=200&h=200&fit=crop",
    modelPath: "/models/dining-table.glb",
    description: "Elegant dining table"
  },
  {
    id: 17,
    name: "Coffee Table",
    category: "tables",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    modelPath: "/models/coffee-table.glb",
    description: "Modern coffee table"
  },
  {
    id: 18,
    name: "Side Table",
    category: "tables",
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
    modelPath: "/models/side-table.glb",
    description: "Compact side table"
  },
  {
    id: 19,
    name: "Study Desk",
    category: "tables",
    thumbnail: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=200&h=200&fit=crop",
    modelPath: "/models/study-desk.glb",
    description: "Functional study desk"
  },
  {
    id: 20,
    name: "Console Table",
    category: "tables",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    modelPath: "/models/console-table.glb",
    description: "Sleek console table"
  },

  // Wall Decor
  {
    id: 21,
    name: "Wall Art",
    category: "wall-decor",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop",
    modelPath: "/models/wall-art.glb",
    description: "Modern wall artwork"
  },
  {
    id: 22,
    name: "Mirror",
    category: "wall-decor",
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
    modelPath: "/models/mirror.glb",
    description: "Decorative wall mirror"
  },
  {
    id: 23,
    name: "Floating Shelf",
    category: "wall-decor",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    modelPath: "/models/floating-shelf.glb",
    description: "Minimalist floating shelf"
  },
  {
    id: 24,
    name: "Wall Clock",
    category: "wall-decor",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop",
    modelPath: "/models/wall-clock.glb",
    description: "Modern wall clock"
  },
  {
    id: 25,
    name: "Wall Sconce",
    category: "wall-decor",
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
    modelPath: "/models/wall-sconce.glb",
    description: "Stylish wall sconce"
  },

  // Dining
  {
    id: 26,
    name: "Dining Set",
    category: "dining",
    thumbnail: "https://images.unsplash.com/photo-1549497538-303791108f95?w=200&h=200&fit=crop",
    modelPath: "/models/dining-set.glb",
    description: "Complete dining set"
  },
  {
    id: 27,
    name: "Bar Stool",
    category: "dining",
    thumbnail: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=200&h=200&fit=crop",
    modelPath: "/models/bar-stool.glb",
    description: "Modern bar stool"
  },
  {
    id: 28,
    name: "Buffet",
    category: "dining",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    modelPath: "/models/buffet.glb",
    description: "Elegant dining buffet"
  },
  {
    id: 29,
    name: "Wine Rack",
    category: "dining",
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
    modelPath: "/models/wine-rack.glb",
    description: "Stylish wine storage rack"
  },
  {
    id: 30,
    name: "China Cabinet",
    category: "dining",
    thumbnail: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=200&fit=crop",
    modelPath: "/models/china-cabinet.glb",
    description: "Traditional china display cabinet"
  },

  // Cutlery
  {
    id: 31,
    name: "Dinnerware Set",
    category: "cutlery",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    modelPath: "/models/dinnerware-set.glb",
    description: "Complete dinnerware collection"
  },
  {
    id: 32,
    name: "Silverware",
    category: "cutlery",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    modelPath: "/models/silverware.glb",
    description: "Premium silverware set"
  },
  {
    id: 33,
    name: "Glassware",
    category: "cutlery",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    modelPath: "/models/glassware.glb",
    description: "Elegant glassware collection"
  },
  {
    id: 34,
    name: "Serving Tray",
    category: "cutlery",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    modelPath: "/models/serving-tray.glb",
    description: "Decorative serving tray"
  },
  {
    id: 35,
    name: "Centerpiece",
    category: "cutlery",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    modelPath: "/models/centerpiece.glb",
    description: "Table centerpiece decoration"
  },
];
