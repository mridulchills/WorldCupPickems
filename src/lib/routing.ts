import routingData from '@/data/thirdPlaceRouting.json';

type ThirdPlaceRoutingData = Record<string, Record<string, string>>;
const thirdPlaceRouting: ThirdPlaceRoutingData = routingData as ThirdPlaceRoutingData;

const VALID_GROUPS = new Set(["A","B","C","D","E","F","G","H","I","J","K","L"]);

/**
 * Generates the routing key by sorting the 8 groups alphabetically.
 * Example: ["L", "F", "I", "E", "G", "K", "H", "J"] -> "EFGHIJKL"
 */
export function generateThirdPlaceKey(groups: string[]): string {
  if (!groups || !Array.isArray(groups)) {
    throw new Error('Invalid input: groups must be an array of strings');
  }

  if (groups.length !== 8) {
    throw new Error(`Invalid third-place combination: expected exactly 8 groups, got ${groups.length}`);
  }

  const validGroups = [];
  const seen = new Set<string>();

  for (const g of groups) {
    const upper = g.toUpperCase();
    if (!VALID_GROUPS.has(upper)) {
      throw new Error(`Invalid third-place combination: invalid group '${upper}'`);
    }
    if (seen.has(upper)) {
      throw new Error(`Invalid third-place combination: duplicate group '${upper}'`);
    }
    seen.add(upper);
    validGroups.push(upper);
  }

  return validGroups.sort().join('');
}

/**
 * Returns the routing mapping for the given 8 qualified third-place groups.
 * Example return: { "A1": "3E", "B1": "3J", ... }
 */
export function getThirdPlaceRouting(qualifiedThirdPlaceGroups: string[]): Record<string, string> {
  const key = generateThirdPlaceKey(qualifiedThirdPlaceGroups);
  const routing = thirdPlaceRouting[key];
  
  if (!routing) {
    throw new Error(`Invalid FIFA third-place combination: ${key}`);
  }
  
  return routing;
}
