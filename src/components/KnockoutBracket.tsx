'use client';

import React from 'react';
import { TEAMS } from '@/lib/teams';
import { 
  TournamentData, 
  getRoundOf32Matches, 
  getRoundOf16Matches, 
  getQuarterFinalMatches, 
  getSemiFinalMatches 
} from '@/lib/scoring';

interface KnockoutBracketProps {
  groupStandings: Record<string, string[]>;
  bestThirdPlace: string[];
  predictions: TournamentData;
  onChange: (updated: TournamentData) => void;
  isReadOnly?: boolean;
}

export default function KnockoutBracket({ 
  groupStandings, 
  bestThirdPlace, 
  predictions, 
  onChange,
  isReadOnly = false
}: KnockoutBracketProps) {
  
  // 1. Generate matchups for each round
  const r32Matches = getRoundOf32Matches(groupStandings, bestThirdPlace);
  const r16Matches = getRoundOf16Matches(predictions.r32Winners);
  const r8Matches = getQuarterFinalMatches(predictions.r16Winners);
  const r4Matches = getSemiFinalMatches(predictions.r8Winners);

  // Derive Third Place Matchup (Losers of SF Matches)
  const getSFLoser = (matchIdx: number) => {
    const match = r4Matches[matchIdx];
    if (!match) return `Loser SF Match ${matchIdx + 1}`;
    
    const winner = predictions.r4Winners[matchIdx];
    if (!winner) return `Loser of SF ${matchIdx + 1}`;
    
    return match.home === winner ? match.away : match.home;
  };

  const thirdPlaceMatch = {
    id: 1,
    home: getSFLoser(0),
    away: getSFLoser(1)
  };

  // Derive Final Matchup (Winners of SF Matches)
  const finalMatch = {
    id: 1,
    home: predictions.r4Winners[0] || 'Winner SF 1',
    away: predictions.r4Winners[1] || 'Winner SF 2'
  };

  const handleMatchSelect = (
    round: 'r32' | 'r16' | 'r8' | 'r4' | 'third' | 'final', 
    matchIdx: number, 
    selectedTeamId: string
  ) => {
    if (isReadOnly) return;
    
    // Check if selecting a placeholder
    if (
      !selectedTeamId ||
      selectedTeamId.includes('Winner') ||
      selectedTeamId.includes('Runner') ||
      selectedTeamId.includes('3rd') ||
      selectedTeamId.includes('Loser') ||
      selectedTeamId.includes('SF')
    ) {
      return;
    }

    const updates: Partial<TournamentData> = {};

    if (round === 'r32') {
      const current = [...(predictions.r32Winners || Array(16).fill(''))];
      const oldWinner = current[matchIdx];
      current[matchIdx] = selectedTeamId;
      updates.r32Winners = current;

      if (oldWinner && oldWinner !== selectedTeamId) {
        // Clean downstream
        updates.r16Winners = (predictions.r16Winners || Array(8).fill('')).map(w => w === oldWinner ? '' : w);
        updates.r8Winners = (predictions.r8Winners || Array(4).fill('')).map(w => w === oldWinner ? '' : w);
        updates.r4Winners = (predictions.r4Winners || Array(2).fill('')).map(w => w === oldWinner ? '' : w);
        if (predictions.thirdPlaceWinner === oldWinner) updates.thirdPlaceWinner = '';
        if (predictions.champion === oldWinner) updates.champion = '';
      }
    } else if (round === 'r16') {
      const current = [...(predictions.r16Winners || Array(8).fill(''))];
      const oldWinner = current[matchIdx];
      current[matchIdx] = selectedTeamId;
      updates.r16Winners = current;

      if (oldWinner && oldWinner !== selectedTeamId) {
        updates.r8Winners = (predictions.r8Winners || Array(4).fill('')).map(w => w === oldWinner ? '' : w);
        updates.r4Winners = (predictions.r4Winners || Array(2).fill('')).map(w => w === oldWinner ? '' : w);
        if (predictions.thirdPlaceWinner === oldWinner) updates.thirdPlaceWinner = '';
        if (predictions.champion === oldWinner) updates.champion = '';
      }
    } else if (round === 'r8') {
      const current = [...(predictions.r8Winners || Array(4).fill(''))];
      const oldWinner = current[matchIdx];
      current[matchIdx] = selectedTeamId;
      updates.r8Winners = current;

      if (oldWinner && oldWinner !== selectedTeamId) {
        updates.r4Winners = (predictions.r4Winners || Array(2).fill('')).map(w => w === oldWinner ? '' : w);
        if (predictions.thirdPlaceWinner === oldWinner) updates.thirdPlaceWinner = '';
        if (predictions.champion === oldWinner) updates.champion = '';
      }
    } else if (round === 'r4') {
      const current = [...(predictions.r4Winners || Array(2).fill(''))];
      const oldWinner = current[matchIdx];
      current[matchIdx] = selectedTeamId;
      updates.r4Winners = current;

      if (oldWinner && oldWinner !== selectedTeamId) {
        if (predictions.champion === oldWinner) updates.champion = '';
        updates.thirdPlaceWinner = ''; // Loser pool changed
      }
    } else if (round === 'third') {
      updates.thirdPlaceWinner = selectedTeamId;
    } else if (round === 'final') {
      updates.champion = selectedTeamId;
    }

    onChange({ ...predictions, ...updates });
  };

  // Helper to render a team item in a matchup card
  const renderMatchupTeam = (
    teamId: string, 
    round: 'r32' | 'r16' | 'r8' | 'r4' | 'third' | 'final', 
    matchIdx: number, 
    isSelected: boolean,
    isOpponentSelected: boolean
  ) => {
    const team = TEAMS.find(t => t.id === teamId);
    const isPlaceholder = !team;
    
    let displayName = teamId;
    if (!isPlaceholder && team) {
      displayName = team.name;
    }

    const disabled = isPlaceholder || isReadOnly;

    return (
      <div 
        onClick={() => !disabled && handleMatchSelect(round, matchIdx, teamId)}
        className={`matchup-team ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      >
        <div className="team-info">
          {!isPlaceholder && team ? (
            <>
              <img 
                src={`https://flagcdn.com/16x12/${team.code}.png`} 
                alt={`${team.name} flag`}
                className="flag-img"
              />
              <span className="team-name">{displayName}</span>
            </>
          ) : (
            <span className="team-name" style={{ fontStyle: 'italic', opacity: 0.6 }}>{displayName}</span>
          )}
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
          {isSelected && '✓'}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="editor-note">
        Note: Click on a country within each match card to select the winner and advance them to the next round. Redundant downstream picks are automatically updated.
      </div>
      <div className="bracket-scroll-container">
        <div className="bracket-container">
          
          {/* Round of 32 */}
          <div className="bracket-round">
            <h3 className="bracket-round-header">Round of 32</h3>
            {r32Matches.map((match, idx) => {
              const selected = predictions.r32Winners?.[idx];
              return (
                <div key={`r32-${idx}`} className="matchup-card">
                  <div style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem', borderBottom: '1px solid var(--border-muted)', opacity: 0.5 }}>
                    MATCH {match.id}
                  </div>
                  {renderMatchupTeam(match.home, 'r32', idx, selected === match.home, selected === match.away)}
                  {renderMatchupTeam(match.away, 'r32', idx, selected === match.away, selected === match.home)}
                </div>
              );
            })}
          </div>

          {/* Round of 16 */}
          <div className="bracket-round">
            <h3 className="bracket-round-header">Round of 16</h3>
            {r16Matches.map((match, idx) => {
              const selected = predictions.r16Winners?.[idx];
              return (
                <div key={`r16-${idx}`} className="matchup-card">
                  <div style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem', borderBottom: '1px solid var(--border-muted)', opacity: 0.5 }}>
                    MATCH {match.id}
                  </div>
                  {renderMatchupTeam(match.home, 'r16', idx, selected === match.home, selected === match.away)}
                  {renderMatchupTeam(match.away, 'r16', idx, selected === match.away, selected === match.home)}
                </div>
              );
            })}
          </div>

          {/* Quarter-finals */}
          <div className="bracket-round">
            <h3 className="bracket-round-header">Quarter-finals</h3>
            {r8Matches.map((match, idx) => {
              const selected = predictions.r8Winners?.[idx];
              return (
                <div key={`r8-${idx}`} className="matchup-card">
                  <div style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem', borderBottom: '1px solid var(--border-muted)', opacity: 0.5 }}>
                    QF {match.id}
                  </div>
                  {renderMatchupTeam(match.home, 'r8', idx, selected === match.home, selected === match.away)}
                  {renderMatchupTeam(match.away, 'r8', idx, selected === match.away, selected === match.home)}
                </div>
              );
            })}
          </div>

          {/* Semi-finals */}
          <div className="bracket-round">
            <h3 className="bracket-round-header">Semi-finals</h3>
            {r4Matches.map((match, idx) => {
              const selected = predictions.r4Winners?.[idx];
              return (
                <div key={`r4-${idx}`} className="matchup-card">
                  <div style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem', borderBottom: '1px solid var(--border-muted)', opacity: 0.5 }}>
                    SF {match.id}
                  </div>
                  {renderMatchupTeam(match.home, 'r4', idx, selected === match.home, selected === match.away)}
                  {renderMatchupTeam(match.away, 'r4', idx, selected === match.away, selected === match.home)}
                </div>
              );
            })}
          </div>

          {/* Finals / 3rd Place */}
          <div className="bracket-round" style={{ justifyContent: 'center', gap: '3rem' }}>
            <div>
              <h3 className="bracket-round-header">Third Place</h3>
              <div className="matchup-card">
                <div style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem', borderBottom: '1px solid var(--border-muted)', opacity: 0.5 }}>
                  PLAY-OFF
                </div>
                {renderMatchupTeam(thirdPlaceMatch.home, 'third', 0, predictions.thirdPlaceWinner === thirdPlaceMatch.home, predictions.thirdPlaceWinner === thirdPlaceMatch.away)}
                {renderMatchupTeam(thirdPlaceMatch.away, 'third', 0, predictions.thirdPlaceWinner === thirdPlaceMatch.away, predictions.thirdPlaceWinner === thirdPlaceMatch.home)}
              </div>
            </div>

            <div>
              <h3 className="bracket-round-header">Final</h3>
              <div className="matchup-card">
                <div style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem', borderBottom: '1px solid var(--border-muted)', opacity: 0.5 }}>
                  CHAMPIONSHIP MATCH
                </div>
                {renderMatchupTeam(finalMatch.home, 'final', 0, predictions.champion === finalMatch.home, predictions.champion === finalMatch.away)}
                {renderMatchupTeam(finalMatch.away, 'final', 0, predictions.champion === finalMatch.away, predictions.champion === finalMatch.home)}
              </div>
            </div>
          </div>

          {/* Champion */}
          <div className="bracket-round" style={{ justifyContent: 'center' }}>
            <h3 className="bracket-round-header">Champion</h3>
            <div 
              className="group-card" 
              style={{ 
                textAlign: 'center', 
                border: '2px solid var(--border-color)', 
                padding: '2rem 1.5rem',
                backgroundColor: predictions.champion ? 'var(--accent-color)' : 'transparent',
                color: predictions.champion ? 'var(--accent-foreground)' : 'var(--foreground-color)'
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', opacity: 0.8 }}>
                WORLD CUP WINNER
              </div>
              {predictions.champion ? (
                <>
                  {(() => {
                    const champ = TEAMS.find(t => t.id === predictions.champion);
                    return champ ? (
                      <div>
                        <img 
                          src={`https://flagcdn.com/32x24/${champ.code}.png`} 
                          alt={`${champ.name} flag`}
                          style={{ border: '1px solid var(--border-muted)', marginBottom: '1rem' }}
                        />
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                          {champ.name}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{predictions.champion}</div>
                    );
                  })()}
                </>
              ) : (
                <div style={{ fontStyle: 'italic', opacity: 0.5, fontSize: '0.9rem' }}>
                  Select winners to crown the champion
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
