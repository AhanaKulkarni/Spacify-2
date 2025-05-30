export interface VastuRule {
  id: string;
  title: string;
  description: string;
  direction: string;
  severity: "good" | "warning" | "error";
  roomTypes: string[];
  furnitureTypes?: string[];
}

export const vastuRules: VastuRule[] = [
  {
    id: "bed-south",
    title: "Bed Placement",
    description: "Headboard should face South or West for better sleep",
    direction: "South/West",
    severity: "good",
    roomTypes: ["bedroom"],
    furnitureTypes: ["beds"]
  },
  {
    id: "mirror-north",
    title: "Mirror Position",
    description: "Place mirrors on North wall only",
    direction: "North",
    severity: "warning",
    roomTypes: ["bedroom", "living-room"],
    furnitureTypes: ["wall-decor"]
  },
  {
    id: "kitchen-southeast",
    title: "Kitchen Direction",
    description: "Kitchen should be in Southeast corner",
    direction: "Southeast",
    severity: "good",
    roomTypes: ["kitchen"]
  },
  {
    id: "pooja-northeast",
    title: "Pooja Room",
    description: "Prayer room should be in Northeast",
    direction: "Northeast",
    severity: "good",
    roomTypes: ["pooja"]
  },
  {
    id: "dining-west",
    title: "Dining Area",
    description: "Dining table placement in West or Northwest",
    direction: "West/Northwest",
    severity: "good",
    roomTypes: ["dining", "kitchen"],
    furnitureTypes: ["dining", "tables"]
  },
  {
    id: "entrance-north",
    title: "Main Entrance",
    description: "Main door should face North or East",
    direction: "North/East",
    severity: "warning",
    roomTypes: ["living-room"]
  },
  {
    id: "heavy-furniture-south",
    title: "Heavy Furniture",
    description: "Place heavy furniture in South or West direction",
    direction: "South/West",
    severity: "good",
    roomTypes: ["living-room", "bedroom"],
    furnitureTypes: ["sofas", "beds"]
  },
  {
    id: "water-northeast",
    title: "Water Element",
    description: "Water features should be in Northeast",
    direction: "Northeast",
    severity: "good",
    roomTypes: ["living-room", "garden"]
  },
  {
    id: "study-east",
    title: "Study Area",
    description: "Study desk should face East for concentration",
    direction: "East",
    severity: "good",
    roomTypes: ["bedroom", "office"],
    furnitureTypes: ["tables"]
  },
  {
    id: "storage-south",
    title: "Storage",
    description: "Storage cabinets in South or West walls",
    direction: "South/West",
    severity: "good",
    roomTypes: ["bedroom", "kitchen", "living-room"]
  }
];

export function getVastuRecommendations(roomType: string, furnitureType?: string): VastuRule[] {
  return vastuRules.filter(rule => {
    const matchesRoom = rule.roomTypes.includes(roomType);
    const matchesFurniture = !furnitureType || !rule.furnitureTypes || 
                            rule.furnitureTypes.includes(furnitureType);
    return matchesRoom && matchesFurniture;
  });
}

export function getDirectionAdvice(direction: string): string {
  const directionMap: { [key: string]: string } = {
    "North": "Associated with wealth and career growth",
    "Northeast": "Most auspicious direction, brings positive energy",
    "East": "Direction of new beginnings and health",
    "Southeast": "Fire element, ideal for kitchen",
    "South": "Stability and fame",
    "Southwest": "Grounding energy, good for rest",
    "West": "Knowledge and children",
    "Northwest": "Movement and travel"
  };
  
  return directionMap[direction] || "Follow traditional Vastu principles";
}

export function checkVastuCompliance(
  roomType: string, 
  furnitureItems: any[], 
  roomOrientation: string = "North"
): { compliant: number; warnings: number; total: number; suggestions: string[] } {
  const relevantRules = getVastuRecommendations(roomType);
  let compliant = 0;
  let warnings = 0;
  const suggestions: string[] = [];

  relevantRules.forEach(rule => {
    // Simple compliance check based on rule severity
    if (rule.severity === "good") {
      compliant++;
      suggestions.push(`✓ ${rule.title}: ${rule.description}`);
    } else if (rule.severity === "warning") {
      warnings++;
      suggestions.push(`⚠ ${rule.title}: ${rule.description}`);
    }
  });

  return {
    compliant,
    warnings,
    total: relevantRules.length,
    suggestions
  };
}
