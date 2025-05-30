export interface VastuRule {
  id: string;
  title: string;
  description: string;
  direction: 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
  roomType: string[];
  furnitureType?: string[];
  status: 'good' | 'warning' | 'bad';
  recommendation: string;
}

export const vastuRules: VastuRule[] = [
  // Bedroom Rules
  {
    id: 'bed-headboard-south',
    title: 'Bed Headboard Direction',
    description: 'Bed headboard should face South or West for better sleep quality',
    direction: 'south',
    roomType: ['Bedroom'],
    furnitureType: ['Beds'],
    status: 'good',
    recommendation: 'Place bed with headboard against south or west wall'
  },
  {
    id: 'mirror-bedroom-avoid',
    title: 'Mirror Placement in Bedroom',
    description: 'Avoid mirrors directly facing the bed',
    direction: 'north',
    roomType: ['Bedroom'],
    furnitureType: ['Wall Decor'],
    status: 'warning',
    recommendation: 'Place mirrors on north wall, avoid direct bed reflection'
  },
  {
    id: 'bedroom-northeast-avoid',
    title: 'Bedroom Location',
    description: 'Avoid placing master bedroom in northeast corner',
    direction: 'northeast',
    roomType: ['Bedroom'],
    status: 'bad',
    recommendation: 'Master bedroom should be in southwest portion of house'
  },

  // Living Room Rules
  {
    id: 'sofa-south-west',
    title: 'Sofa Placement',
    description: 'Sofa should be placed against south or west wall',
    direction: 'south',
    roomType: ['Living Room'],
    furnitureType: ['Sofas'],
    status: 'good',
    recommendation: 'Position main seating against south or west wall facing north or east'
  },
  {
    id: 'tv-southeast',
    title: 'Television Placement',
    description: 'TV should be placed in southeast corner for positive energy',
    direction: 'southeast',
    roomType: ['Living Room'],
    furnitureType: ['Wall Decor'],
    status: 'good',
    recommendation: 'Mount TV on southeast wall for optimal viewing and energy flow'
  },

  // Kitchen Rules
  {
    id: 'kitchen-southeast',
    title: 'Kitchen Direction',
    description: 'Kitchen should be located in southeast portion of house',
    direction: 'southeast',
    roomType: ['Kitchen'],
    status: 'good',
    recommendation: 'Southeast kitchen brings prosperity and good health'
  },
  {
    id: 'stove-east-facing',
    title: 'Cooking Direction',
    description: 'Cook facing east direction for positive energy',
    direction: 'east',
    roomType: ['Kitchen'],
    status: 'good',
    recommendation: 'Position stove so you face east while cooking'
  },

  // Pooja Room Rules
  {
    id: 'pooja-northeast',
    title: 'Pooja Room Location',
    description: 'Pooja room should be in northeast corner for maximum spiritual benefit',
    direction: 'northeast',
    roomType: ['Pooja'],
    status: 'good',
    recommendation: 'Northeast pooja room brings divine blessings and peace'
  },
  {
    id: 'deity-east-facing',
    title: 'Deity Direction',
    description: 'Deities should face east or west, devotee should face east while praying',
    direction: 'east',
    roomType: ['Pooja'],
    status: 'good',
    recommendation: 'Position altar so deities face east or west'
  },

  // Dining Room Rules
  {
    id: 'dining-west-south',
    title: 'Dining Table Placement',
    description: 'Dining table should be in west or south portion of dining room',
    direction: 'west',
    roomType: ['Dining'],
    furnitureType: ['Dining', 'Tables'],
    status: 'good',
    recommendation: 'Place dining table in west or south area for good digestion'
  },
  {
    id: 'dining-facing-east',
    title: 'Dining Direction',
    description: 'Face east or north while eating for better health',
    direction: 'east',
    roomType: ['Dining'],
    status: 'good',
    recommendation: 'Arrange seating so family faces east or north while dining'
  },

  // General Rules
  {
    id: 'entrance-northeast',
    title: 'Main Entrance',
    description: 'Main entrance should be in north, northeast, or east for positive energy',
    direction: 'northeast',
    roomType: ['Living Room', 'Bedroom', 'Kitchen', 'Dining'],
    status: 'good',
    recommendation: 'North, northeast, or east entrances bring prosperity'
  },
  {
    id: 'clutter-free-northeast',
    title: 'Northeast Corner',
    description: 'Keep northeast corner clean and clutter-free',
    direction: 'northeast',
    roomType: ['Living Room', 'Bedroom', 'Kitchen', 'Dining'],
    status: 'good',
    recommendation: 'Northeast corner should be light and airy, avoid heavy furniture'
  }
];

export const getVastuRulesForRoom = (roomType: string): VastuRule[] => {
  return vastuRules.filter(rule => rule.roomType.includes(roomType));
};

export const getVastuRulesForFurniture = (furnitureType: string): VastuRule[] => {
  return vastuRules.filter(rule => rule.furnitureType?.includes(furnitureType));
};

export const getDirectionalTips = (direction: string): VastuRule[] => {
  return vastuRules.filter(rule => rule.direction === direction);
};
