import { TEAMS } from './teams';

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
  const getThird = (idx: number) => bestThirdPlace[idx] || `3rd Place #${idx + 1}`;

  return [
    { id: 1, home: getWinner('A'), away: getThird(0) },
    { id: 2, home: getRunnerUp('B'), away: getRunnerUp('C') },
    { id: 3, home: getWinner('D'), away: getThird(1) },
    { id: 4, home: getRunnerUp('E'), away: getRunnerUp('F') },
    { id: 5, home: getWinner('G'), away: getThird(2) },
    { id: 6, home: getWinner('K'), away: getRunnerUp('H') },
    { id: 7, home: getWinner('J'), away: getThird(3) },
    { id: 8, home: getRunnerUp('I'), away: getRunnerUp('L') },
    { id: 9, home: getWinner('B'), away: getThird(4) },
    { id: 10, home: getRunnerUp('A'), away: getRunnerUp('D') },
    { id: 11, home: getWinner('C'), away: getThird(5) },
    { id: 12, home: getWinner('I'), away: getRunnerUp('G') },
    { id: 13, home: getWinner('E'), away: getThird(6) },
    { id: 14, home: getWinner('L'), away: getRunnerUp('J') },
    { id: 15, home: getWinner('F'), away: getThird(7) },
    { id: 16, home: getWinner('H'), away: getRunnerUp('K') }
  ];
}

// Determine matchups for R16
export function getRoundOf16Matches(r32Winners: string[]): { home: string; away: string; id: number }[] {
  const getWinnerOfMatch = (matchId: number) => r32Winners[matchId - 1] || `Winner R32 Match ${matchId}`;
  return [
    { id: 1, home: getWinnerOfMatch(1), away: getWinnerOfMatch(2) },
    { id: 2, home: getWinnerOfMatch(3), away: getWinnerOfMatch(4) },
    { id: 3, home: getWinnerOfMatch(5), away: getWinnerOfMatch(6) },
    { id: 4, home: getWinnerOfMatch(7), away: getWinnerOfMatch(8) },
    { id: 5, home: getWinnerOfMatch(9), away: getWinnerOfMatch(10) },
    { id: 6, home: getWinnerOfMatch(11), away: getWinnerOfMatch(12) },
    { id: 7, home: getWinnerOfMatch(13), away: getWinnerOfMatch(14) },
    { id: 8, home: getWinnerOfMatch(15), away: getWinnerOfMatch(16) }
  ];
}

// Determine matchups for Quarterfinals
export function getQuarterFinalMatches(r16Winners: string[]): { home: string; away: string; id: number }[] {
  const getWinnerOfMatch = (matchId: number) => r16Winners[matchId - 1] || `Winner R16 Match ${matchId}`;
  return [
    { id: 1, home: getWinnerOfMatch(1), away: getWinnerOfMatch(2) },
    { id: 2, home: getWinnerOfMatch(3), away: getWinnerOfMatch(4) },
    { id: 3, home: getWinnerOfMatch(5), away: getWinnerOfMatch(6) },
    { id: 4, home: getWinnerOfMatch(7), away: getWinnerOfMatch(8) }
  ];
}

// Determine matchups for Semifinals
export function getSemiFinalMatches(r8Winners: string[]): { home: string; away: string; id: number }[] {
  const getWinnerOfMatch = (matchId: number) => r8Winners[matchId - 1] || `Winner QF Match ${matchId}`;
  return [
    { id: 1, home: getWinnerOfMatch(1), away: getWinnerOfMatch(2) },
    { id: 2, home: getWinnerOfMatch(3), away: getWinnerOfMatch(4) }
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
