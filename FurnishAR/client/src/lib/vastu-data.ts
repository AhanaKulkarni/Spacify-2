// Vastu guidance data and rules
export interface VastuRule {
  id: string;
  title: string;
  description: string;
  roomTypes: string[];
  direction: string;
  severity: 'good' | 'warning' | 'bad';
  category: string;
}

export const VASTU_RULES: VastuRule[] = [
  // Bedroom rules
  {
    id: 'bed-head-south',
    title: 'Bed Placement',
    description: 'Headboard should face South or West for better sleep',
    roomTypes: ['bedroom'],
    direction: 'south',
    severity: 'good',
    category: 'furniture',
  },
  {
    id: 'bed-no-mirror-facing',
    title: 'Mirror Position',
    description: 'Avoid mirrors facing the bed directly',
    roomTypes: ['bedroom'],
    direction: 'any',
    severity: 'warning',
    category: 'furniture',
  },
  {
    id: 'bedroom-southwest',
    title: 'Master Bedroom Location',
    description: 'Master bedroom should be in Southwest direction',
    roomTypes: ['bedroom'],
    direction: 'southwest',
    severity: 'good',
    category: 'room',
  },

  // Living room rules
  {
    id: 'living-furniture-arrangement',
    title: 'Furniture Arrangement',
    description: 'Heavy furniture should be placed in South and West walls',
    roomTypes: ['living room', 'living'],
    direction: 'southwest',
    severity: 'good',
    category: 'furniture',
  },
  {
    id: 'living-tv-southeast',
    title: 'TV Placement',
    description: 'Television should be placed in Southeast corner',
    roomTypes: ['living room', 'living'],
    direction: 'southeast',
    severity: 'good',
    category: 'electronics',
  },

  // Kitchen rules
  {
    id: 'kitchen-southeast',
    title: 'Kitchen Direction',
    description: 'Kitchen should be in Southeast direction for positive energy',
    roomTypes: ['kitchen'],
    direction: 'southeast',
    severity: 'good',
    category: 'room',
  },
  {
    id: 'stove-southeast',
    title: 'Stove Position',
    description: 'Cooking stove should face East for health benefits',
    roomTypes: ['kitchen'],
    direction: 'east',
    severity: 'good',
    category: 'appliances',
  },

  // Pooja room rules
  {
    id: 'pooja-northeast',
    title: 'Pooja Room Location',
    description: 'Pooja room should be in Northeast for spiritual energy',
    roomTypes: ['pooja room', 'pooja'],
    direction: 'northeast',
    severity: 'good',
    category: 'room',
  },
  {
    id: 'idol-east-west',
    title: 'Idol Placement',
    description: 'Face East or West while praying',
    roomTypes: ['pooja room', 'pooja'],
    direction: 'east',
    severity: 'good',
    category: 'spiritual',
  },

  // General rules
  {
    id: 'entrance-north-east',
    title: 'Main Entrance',
    description: 'Main entrance should be in North, East, or Northeast',
    roomTypes: ['all'],
    direction: 'northeast',
    severity: 'good',
    category: 'entrance',
  },
  {
    id: 'clutter-free',
    title: 'Clutter Free Space',
    description: 'Keep all rooms clutter-free for positive energy flow',
    roomTypes: ['all'],
    direction: 'any',
    severity: 'good',
    category: 'general',
  },
];

// Direction mappings for compass
export const DIRECTIONS = {
  north: { angle: 0, symbol: 'N', color: '#EF4444' },
  northeast: { angle: 45, symbol: 'NE', color: '#F97316' },
  east: { angle: 90, symbol: 'E', color: '#EAB308' },
  southeast: { angle: 135, symbol: 'SE', color: '#22C55E' },
  south: { angle: 180, symbol: 'S', color: '#3B82F6' },
  southwest: { angle: 225, symbol: 'SW', color: '#8B5CF6' },
  west: { angle: 270, symbol: 'W', color: '#EC4899' },
  northwest: { angle: 315, symbol: 'NW', color: '#06B6D4' },
};

// Get Vastu rules for specific room type
export const getVastuRulesForRoom = (roomType: string): VastuRule[] => {
  return VASTU_RULES.filter(rule => 
    rule.roomTypes.includes(roomType.toLowerCase()) || 
    rule.roomTypes.includes('all')
  );
};

// Get Vastu compliance score for a room
export const calculateVastuScore = (roomType: string, placedItems: any[]): number => {
  const rules = getVastuRulesForRoom(roomType);
  let score = 0;
  let totalRules = rules.length;

  rules.forEach(rule => {
    // Simple scoring logic - in a real app this would be more sophisticated
    if (rule.severity === 'good') {
      score += 10;
    } else if (rule.severity === 'warning') {
      score += 5;
    }
  });

  return totalRules > 0 ? Math.min(100, (score / (totalRules * 10)) * 100) : 100;
};

// Get direction recommendations for furniture placement
export const getDirectionRecommendations = (furnitureType: string, roomType: string): string[] => {
  const recommendations: Record<string, Record<string, string[]>> = {
    bed: {
      bedroom: ['south', 'west'],
      any: ['south', 'west'],
    },
    sofa: {
      'living room': ['south', 'west'],
      any: ['south', 'west'],
    },
    dining: {
      kitchen: ['east', 'southeast'],
      'dining room': ['east', 'southeast'],
      any: ['east', 'southeast'],
    },
    mirror: {
      bedroom: ['north', 'east'],
      any: ['north', 'east'],
    },
  };

  const furnitureRecs = recommendations[furnitureType.toLowerCase()];
  if (furnitureRecs) {
    return furnitureRecs[roomType.toLowerCase()] || furnitureRecs['any'] || [];
  }

  return [];
};

// Generate Vastu tips based on current room setup
export const generateVastuTips = (roomType: string, placedFurniture: any[]): string[] => {
  const tips: string[] = [];
  const rules = getVastuRulesForRoom(roomType);

  // Add general tips based on room type
  if (roomType.toLowerCase() === 'bedroom') {
    tips.push('Keep the bedroom clean and well-ventilated');
    tips.push('Use light colors for walls to promote peace');
    tips.push('Avoid electronic devices near the bed');
  } else if (roomType.toLowerCase() === 'kitchen') {
    tips.push('Ensure good ventilation for positive energy');
    tips.push('Keep the kitchen clean and organized');
    tips.push('Use warm colors like yellow or orange');
  } else if (roomType.toLowerCase().includes('living')) {
    tips.push('Use bright, warm lighting');
    tips.push('Keep the center of the room clutter-free');
    tips.push('Add plants for positive energy');
  }

  // Add specific rules as tips
  rules.forEach(rule => {
    if (rule.severity === 'good') {
      tips.push(rule.description);
    }
  });

  return tips.slice(0, 5); // Return max 5 tips
};
