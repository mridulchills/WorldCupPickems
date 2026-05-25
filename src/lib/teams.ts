export interface Team {
  id: string;
  name: string;
  code: string;
  group: string;
}

export const TEAMS: Team[] = [
  // Group A
  { id: 'USA', name: 'United States', code: 'us', group: 'A' },
  { id: 'MAR', name: 'Morocco', code: 'ma', group: 'A' },
  { id: 'SUI', name: 'Switzerland', code: 'ch', group: 'A' },
  { id: 'KSA', name: 'Saudi Arabia', code: 'sa', group: 'A' },

  // Group B
  { id: 'MEX', name: 'Mexico', code: 'mx', group: 'B' },
  { id: 'CRO', name: 'Croatia', code: 'hr', group: 'B' },
  { id: 'POL', name: 'Poland', code: 'pl', group: 'B' },
  { id: 'KOR', name: 'South Korea', code: 'kr', group: 'B' },

  // Group C
  { id: 'CAN', name: 'Canada', code: 'ca', group: 'C' },
  { id: 'URU', name: 'Uruguay', code: 'uy', group: 'C' },
  { id: 'DEN', name: 'Denmark', code: 'dk', group: 'C' },
  { id: 'EGY', name: 'Egypt', code: 'eg', group: 'C' },

  // Group D
  { id: 'ARG', name: 'Argentina', code: 'ar', group: 'D' },
  { id: 'NED', name: 'Netherlands', code: 'nl', group: 'D' },
  { id: 'TUN', name: 'Tunisia', code: 'tn', group: 'D' },
  { id: 'JPN', name: 'Japan', code: 'jp', group: 'D' },

  // Group E
  { id: 'BRA', name: 'Brazil', code: 'br', group: 'E' },
  { id: 'GER', name: 'Germany', code: 'de', group: 'E' },
  { id: 'PAN', name: 'Panama', code: 'pa', group: 'E' },
  { id: 'AUS', name: 'Australia', code: 'au', group: 'E' },

  // Group F
  { id: 'FRA', name: 'France', code: 'fr', group: 'F' },
  { id: 'COL', name: 'Colombia', code: 'co', group: 'F' },
  { id: 'UKR', name: 'Ukraine', code: 'ua', group: 'F' },
  { id: 'CMR', name: 'Cameroon', code: 'cm', group: 'F' },

  // Group G
  { id: 'ENG', name: 'England', code: 'gb-eng', group: 'G' },
  { id: 'ECU', name: 'Ecuador', code: 'ec', group: 'G' },
  { id: 'AUT', name: 'Austria', code: 'at', group: 'G' },
  { id: 'NGA', name: 'Nigeria', code: 'ng', group: 'G' },

  // Group H
  { id: 'ESP', name: 'Spain', code: 'es', group: 'H' },
  { id: 'CHI', name: 'Chile', code: 'cl', group: 'H' },
  { id: 'TUR', name: 'Turkey', code: 'tr', group: 'H' },
  { id: 'GHA', name: 'Ghana', code: 'gh', group: 'H' },

  // Group I
  { id: 'POR', name: 'Portugal', code: 'pt', group: 'I' },
  { id: 'PER', name: 'Peru', code: 'pe', group: 'I' },
  { id: 'SWE', name: 'Sweden', code: 'se', group: 'I' },
  { id: 'ALG', name: 'Algeria', code: 'dz', group: 'I' },

  // Group J
  { id: 'BEL', name: 'Belgium', code: 'be', group: 'J' },
  { id: 'CRC', name: 'Costa Rica', code: 'cr', group: 'J' },
  { id: 'SCO', name: 'Scotland', code: 'gb-sct', group: 'J' },
  { id: 'IRN', name: 'Iran', code: 'ir', group: 'J' },

  // Group K
  { id: 'ITA', name: 'Italy', code: 'it', group: 'K' },
  { id: 'SEN', name: 'Senegal', code: 'sn', group: 'K' },
  { id: 'WAL', name: 'Wales', code: 'gb-wls', group: 'K' },
  { id: 'QAT', name: 'Qatar', code: 'qa', group: 'K' },

  // Group L
  { id: 'CIV', name: 'Ivory Coast', code: 'ci', group: 'L' },
  { id: 'JAM', name: 'Jamaica', code: 'jm', group: 'L' },
  { id: 'NZL', name: 'New Zealand', code: 'nz', group: 'L' },
  { id: 'MLI', name: 'Mali', code: 'ml', group: 'L' }
];

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
