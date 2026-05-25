import { TEAMS } from './teams';
import { getThirdPlaceRouting } from './routing';

export interface TournamentData {
  groupStandings: Record<string, string[]>; // Group ID -> Array of 4 team IDs in order
  bestThirdPlace: string[]; // 8 team IDs
  r32Winners: string[]; // 16 team IDs (winners of R32 matches)
  r16Winners: string[]; // 8 team IDs (winners of R16 matches)
  r8Winners: string[]; // 4 team IDs (winners of QF matches)
  r4Winners: string[]; // 2 team IDs (winners of SF matches)
  thirdPlaceWinner: string; // 1 team ID
  champion: string; // 1 team ID
}

export function getDefaultTournamentData(): TournamentData {
  const standings: Record<string, string[]> = {};
  TEAMS.forEach(team => {
    if (!standings[team.group]) {
      standings[team.group] = [];
    }
    standings[team.group].push(team.id);
  });

  return {
    groupStandings: standings,
    bestThirdPlace: [],
    r32Winners: Array(16).fill(''),
    r16Winners: Array(8).fill(''),
    r8Winners: Array(4).fill(''),
    r4Winners: Array(2).fill(''),
    thirdPlaceWinner: '',
    champion: ''
  };
}


// Fixed deterministic pairing for the 32 qualified teams
export function getRoundOf32Matches(
  groupStandings: Record<string, string[]>,
  bestThirdPlace: string[]
): { home: string; away: string; id: number }[] {
  // Safe extraction helper
  const getWinner = (g: string) => (groupStandings[g] && groupStandings[g][0]) || `Winner ${g}`;
  const getRunnerUp = (g: string) => (groupStandings[g] && groupStandings[g][1]) || `Runner ${g}`;

  // Get the group letters for the 8 third-place teams
  const thirdPlaceGroups = bestThirdPlace.map(teamId => {
    const team = TEAMS.find(t => t.id === teamId);
    return team ? team.group : '';
  }).filter(Boolean);

  let routing: Record<string, string> | null = null;
  if (thirdPlaceGroups.length === 8) {
    routing = getThirdPlaceRouting(thirdPlaceGroups); // throws if invalid combo
  }

  // Helper to find the team ID for a given "3G" etc.
  const getSpecificThird = (expectedThird: string) => {
    const groupLetter = expectedThird.replace('3', '');
    const teamId = bestThirdPlace.find(id => {
      const t = TEAMS.find(team => team.id === id);
      return t?.group === groupLetter;
    });
    
    if (!teamId) {
      throw new Error(`Routing matched 3rd place from group ${groupLetter} but it is missing from bestThirdPlace selection.`);
    }
    return teamId;
  };

  const getRoutedThird = (winnerCode: string, placeholderIdx: number) => {
    if (thirdPlaceGroups.length < 8 || !routing) {
      return `3rd Place #${placeholderIdx + 1}`;
    }
    
    const targetThird = routing[winnerCode];
    if (!targetThird) {
      throw new Error(`Missing routing target for winner ${winnerCode}`);
    }
    
    return getSpecificThird(targetThird);
  };

  return [
    { id: 73, home: getRunnerUp('A'), away: getRunnerUp('B') },
    { id: 74, home: getWinner('E'), away: getRoutedThird('E1', 0) },
    { id: 75, home: getWinner('F'), away: getRunnerUp('C') },
    { id: 76, home: getWinner('C'), away: getRunnerUp('F') },
    { id: 77, home: getWinner('I'), away: getRoutedThird('I1', 1) },
    { id: 78, home: getRunnerUp('E'), away: getRunnerUp('I') },
    { id: 79, home: getWinner('A'), away: getRoutedThird('A1', 2) },
    { id: 80, home: getWinner('L'), away: getRoutedThird('L1', 3) },
    { id: 81, home: getWinner('D'), away: getRoutedThird('D1', 4) },
    { id: 82, home: getWinner('G'), away: getRoutedThird('G1', 5) },
    { id: 83, home: getRunnerUp('K'), away: getRunnerUp('L') },
    { id: 84, home: getWinner('H'), away: getRunnerUp('J') },
    { id: 85, home: getWinner('B'), away: getRoutedThird('B1', 6) },
    { id: 86, home: getWinner('J'), away: getRunnerUp('H') },
    { id: 87, home: getWinner('K'), away: getRoutedThird('K1', 7) },
    { id: 88, home: getRunnerUp('D'), away: getRunnerUp('G') }
  ];
}

// Determine matchups for R16
export function getRoundOf16Matches(r32Winners: string[]): { home: string; away: string; id: number }[] {
  const getWinnerOfMatch = (matchId: number) => r32Winners[matchId - 73] || `Winner Match ${matchId}`;
  return [
    { id: 89, home: getWinnerOfMatch(73), away: getWinnerOfMatch(75) },
    { id: 90, home: getWinnerOfMatch(74), away: getWinnerOfMatch(76) },
    { id: 91, home: getWinnerOfMatch(77), away: getWinnerOfMatch(79) },
    { id: 92, home: getWinnerOfMatch(78), away: getWinnerOfMatch(80) },
    { id: 93, home: getWinnerOfMatch(81), away: getWinnerOfMatch(83) },
    { id: 94, home: getWinnerOfMatch(82), away: getWinnerOfMatch(84) },
    { id: 95, home: getWinnerOfMatch(85), away: getWinnerOfMatch(87) },
    { id: 96, home: getWinnerOfMatch(86), away: getWinnerOfMatch(88) }
  ];
}

// Determine matchups for Quarterfinals
export function getQuarterFinalMatches(r16Winners: string[]): { home: string; away: string; id: number }[] {
  const getWinnerOfMatch = (matchId: number) => r16Winners[matchId - 89] || `Winner Match ${matchId}`;
  return [
    { id: 97, home: getWinnerOfMatch(89), away: getWinnerOfMatch(90) },
    { id: 98, home: getWinnerOfMatch(93), away: getWinnerOfMatch(94) },
    { id: 99, home: getWinnerOfMatch(91), away: getWinnerOfMatch(92) },
    { id: 100, home: getWinnerOfMatch(95), away: getWinnerOfMatch(96) }
  ];
}

// Determine matchups for Semifinals
export function getSemiFinalMatches(r8Winners: string[]): { home: string; away: string; id: number }[] {
  const getWinnerOfMatch = (matchId: number) => r8Winners[matchId - 97] || `Winner Match ${matchId}`;
  return [
    { id: 101, home: getWinnerOfMatch(97), away: getWinnerOfMatch(98) },
    { id: 102, home: getWinnerOfMatch(99), away: getWinnerOfMatch(100) }
  ];
}

export interface ScoreBreakdown {
  groupStandings: number;
  r32Progress: number;
  r16Progress: number;
  r8Progress: number;
  r4Progress: number;
  finalists: number;
  thirdPlaceWinner: number;
  champion: number;
  total: number;
}

export function calculateScore(prediction: TournamentData, actual: TournamentData): ScoreBreakdown {
  const breakdown: ScoreBreakdown = {
    groupStandings: 0,
    r32Progress: 0,
    r16Progress: 0,
    r8Progress: 0,
    r4Progress: 0,
    finalists: 0,
    thirdPlaceWinner: 0,
    champion: 0,
    total: 0
  };

  // 1. Group Standings Scoring
  // - 5 points for exact position prediction in group
  // - 2 points if predicted to finish 1st or 2nd (or was selected as best 3rd) and they actually progressed, but got the exact position wrong
  const actualProgressedTeams = new Set<string>();
  
  // Extract actual qualified teams
  Object.keys(actual.groupStandings).forEach(group => {
    const standings = actual.groupStandings[group] || [];
    if (standings[0]) actualProgressedTeams.add(standings[0]);
    if (standings[1]) actualProgressedTeams.add(standings[1]);
  });
  (actual.bestThirdPlace || []).forEach(team => {
    if (team) actualProgressedTeams.add(team);
  });

  // Calculate Group points
  Object.keys(actual.groupStandings).forEach(group => {
    const actualOrder = actual.groupStandings[group] || [];
    const predOrder = prediction.groupStandings[group] || [];

    for (let i = 0; i < 4; i++) {
      const predTeam = predOrder[i];
      const actualTeam = actualOrder[i];

      if (predTeam && actualTeam) {
        if (predTeam === actualTeam) {
          // Exact match!
          breakdown.groupStandings += 5;
        } else {
          // Check if they qualified anyway
          const isQualifier = i === 0 || i === 1 || (i === 2 && prediction.bestThirdPlace.includes(predTeam));
          if (isQualifier && actualProgressedTeams.has(predTeam)) {
            breakdown.groupStandings += 2;
          }
        }
      }
    }
  });

  // Helper sets for checking actual progressors in each round
  const actualR16 = new Set(actual.r32Winners || []);
  const actualR8 = new Set(actual.r16Winners || []);
  const actualR4 = new Set(actual.r8Winners || []);
  const actualFinalists = new Set(actual.r4Winners || []);

  // 2. R32 Winners progress (R16 qualification): 10 points per team
  const predR32Winners = prediction.r32Winners || [];
  predR32Winners.forEach(team => {
    if (team && actualR16.has(team)) {
      breakdown.r32Progress += 10;
    }
  });

  // 3. R16 Winners progress (Quarterfinals qualification): 20 points per team
  const predR16Winners = prediction.r16Winners || [];
  predR16Winners.forEach(team => {
    if (team && actualR8.has(team)) {
      breakdown.r16Progress += 20;
    }
  });

  // 4. R8 Winners progress (Semifinals qualification): 40 points per team
  const predR8Winners = prediction.r8Winners || [];
  predR8Winners.forEach(team => {
    if (team && actualR4.has(team)) {
      breakdown.r8Progress += 40;
    }
  });

  // 5. R4 Winners progress (Finals qualification): 80 points per team
  const predR4Winners = prediction.r4Winners || [];
  predR4Winners.forEach(team => {
    if (team && actualFinalists.has(team)) {
      breakdown.r4Progress += 80;
    }
  });

  // 6. Finalists prediction: 150 points for each correct finalist
  // Wait, let's look at the champion and finalist selections.
  // Prediction.champion is the champion, prediction.r4Winners are the finalists.
  // Let's check if the predicted champion and runner-up are in actual finalists.
  // Actually, we can check if they correctly matched the finalists:
  const predFinalists = prediction.r4Winners || [];
  predFinalists.forEach(team => {
    if (team && actualFinalists.has(team)) {
      breakdown.finalists += 150;
    }
  });

  // 7. Third-place winner: 100 points
  if (prediction.thirdPlaceWinner && prediction.thirdPlaceWinner === actual.thirdPlaceWinner) {
    breakdown.thirdPlaceWinner += 100;
  }

  // 8. Champion: 300 points
  if (prediction.champion && prediction.champion === actual.champion) {
    breakdown.champion += 300;
  }

  // Grand Total
  breakdown.total = 
    breakdown.groupStandings +
    breakdown.r32Progress +
    breakdown.r16Progress +
    breakdown.r8Progress +
    breakdown.r4Progress +
    breakdown.finalists +
    breakdown.thirdPlaceWinner +
    breakdown.champion;

  return breakdown;
}
