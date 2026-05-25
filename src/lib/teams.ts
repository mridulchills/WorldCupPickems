export interface Team {
  id: string;
  name: string;
  code: string;
  group: string;
}

export const TEAMS: Team[] = [
  // Group A
  { id: 'MEX', name: 'Mexico', code: 'mx', group: 'A' },
  { id: 'KOR', name: 'South Korea', code: 'kr', group: 'A' },
  { id: 'CZE', name: 'Czech Republic', code: 'cz', group: 'A' },
  { id: 'RSA', name: 'South Africa', code: 'za', group: 'A' },

  // Group B
  { id: 'CAN', name: 'Canada', code: 'ca', group: 'B' },
  { id: 'SUI', name: 'Switzerland', code: 'ch', group: 'B' },
  { id: 'BIH', name: 'Bosnia and Herzegovina', code: 'ba', group: 'B' },
  { id: 'QAT', name: 'Qatar', code: 'qa', group: 'B' },

  // Group C
  { id: 'BRA', name: 'Brazil', code: 'br', group: 'C' },
  { id: 'SCO', name: 'Scotland', code: 'gb-sct', group: 'C' },
  { id: 'MAR', name: 'Morocco', code: 'ma', group: 'C' },
  { id: 'HAI', name: 'Haiti', code: 'ht', group: 'C' },

  // Group D
  { id: 'USA', name: 'United States', code: 'us', group: 'D' },
  { id: 'TUR', name: 'Turkey', code: 'tr', group: 'D' },
  { id: 'PAR', name: 'Paraguay', code: 'py', group: 'D' },
  { id: 'AUS', name: 'Australia', code: 'au', group: 'D' },

  // Group E
  { id: 'GER', name: 'Germany', code: 'de', group: 'E' },
  { id: 'ECU', name: 'Ecuador', code: 'ec', group: 'E' },
  { id: 'CIV', name: 'Ivory Coast', code: 'ci', group: 'E' },
  { id: 'CUW', name: 'Curaçao', code: 'cw', group: 'E' },

  // Group F
  { id: 'NED', name: 'Netherlands', code: 'nl', group: 'F' },
  { id: 'JPN', name: 'Japan', code: 'jp', group: 'F' },
  { id: 'SWE', name: 'Sweden', code: 'se', group: 'F' },
  { id: 'TUN', name: 'Tunisia', code: 'tn', group: 'F' },

  // Group G
  { id: 'BEL', name: 'Belgium', code: 'be', group: 'G' },
  { id: 'IRN', name: 'Iran', code: 'ir', group: 'G' },
  { id: 'EGY', name: 'Egypt', code: 'eg', group: 'G' },
  { id: 'NZL', name: 'New Zealand', code: 'nz', group: 'G' },

  // Group H
  { id: 'ESP', name: 'Spain', code: 'es', group: 'H' },
  { id: 'URU', name: 'Uruguay', code: 'uy', group: 'H' },
  { id: 'KSA', name: 'Saudi Arabia', code: 'sa', group: 'H' },
  { id: 'CPV', name: 'Cape Verde', code: 'cv', group: 'H' },

  // Group I
  { id: 'FRA', name: 'France', code: 'fr', group: 'I' },
  { id: 'SEN', name: 'Senegal', code: 'sn', group: 'I' },
  { id: 'NOR', name: 'Norway', code: 'no', group: 'I' },
  { id: 'IRQ', name: 'Iraq', code: 'iq', group: 'I' },

  // Group J
  { id: 'ARG', name: 'Argentina', code: 'ar', group: 'J' },
  { id: 'AUT', name: 'Austria', code: 'at', group: 'J' },
  { id: 'ALG', name: 'Algeria', code: 'dz', group: 'J' },
  { id: 'JOR', name: 'Jordan', code: 'jo', group: 'J' },

  // Group K
  { id: 'POR', name: 'Portugal', code: 'pt', group: 'K' },
  { id: 'COL', name: 'Colombia', code: 'co', group: 'K' },
  { id: 'COD', name: 'DR Congo', code: 'cd', group: 'K' },
  { id: 'UZB', name: 'Uzbekistan', code: 'uz', group: 'K' },

  // Group L
  { id: 'ENG', name: 'England', code: 'gb-eng', group: 'L' },
  { id: 'CRO', name: 'Croatia', code: 'hr', group: 'L' },
  { id: 'GHA', name: 'Ghana', code: 'gh', group: 'L' },
  { id: 'PAN', name: 'Panama', code: 'pa', group: 'L' }
];

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
