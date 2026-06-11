'use client';

import React from 'react';
import { TEAMS } from '@/lib/teams';

interface ThirdPlaceSelectorProps {
  groupStandings: Record<string, string[]>;
  selectedThirds: string[];
  onChange: (selected: string[]) => void;
  isReadOnly?: boolean;
}

export default function ThirdPlaceSelector({ groupStandings, selectedThirds, onChange, isReadOnly = false }: ThirdPlaceSelectorProps) {
  // Extract 3rd place teams from all 12 groups
  const thirdPlaceTeams = Object.keys(groupStandings).map(group => {
    const teamsInGroup = groupStandings[group] || [];
    const thirdTeamId = teamsInGroup[2]; // Index 2 is 3rd place
    return {
      group,
      team: TEAMS.find(t => t.id === thirdTeamId)
    };
  }).filter(item => item.team !== undefined) as { group: string; team: typeof TEAMS[0] }[];

  const handleToggle = (teamId: string) => {
    if (isReadOnly) return;
    const isSelected = selectedThirds.includes(teamId);
    if (isSelected) {
      onChange(selectedThirds.filter(id => id !== teamId));
    } else {
      if (selectedThirds.length >= 8) {
        // Can't select more than 8
        alert('You can only select exactly 8 third-placed teams.');
        return;
      }
      onChange([...selectedThirds, teamId]);
    }
  };

  return (
    <div className="third-place-container">
      <h2 className="third-place-instruction">Select the 8 Best Third-Placed Teams</h2>
      <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
        Under the new 48-team format, 8 of the 12 third-placed teams qualify for the Round of 32. 
        Select the 8 teams you believe will have the best record. 
        <strong> Current Selection: {selectedThirds.length} / 8</strong>
      </p>

      <div className="third-place-list" style={isReadOnly ? { opacity: 0.85 } : undefined}>
        {thirdPlaceTeams.map(({ group, team }) => {
          const isSelected = selectedThirds.includes(team.id);
          const isDisabled = (!isSelected && selectedThirds.length >= 8) || isReadOnly;

          return (
            <div 
              key={team.id}
              onClick={() => !isDisabled && handleToggle(team.id)}
              className={`third-place-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              style={isReadOnly ? { cursor: 'not-allowed' } : undefined}
            >
              <div className="team-info">
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid currentColor', padding: '0.1rem 0.3rem' }}>
                  GP {group}
                </span>
                <img 
                  src={`https://flagcdn.com/16x12/${team.code}.png`} 
                  alt={`${team.name} flag`}
                  className="flag-img"
                />
                <span className="team-name">{team.name}</span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                {isSelected ? 'SELECTED' : isReadOnly ? '—' : 'SELECT'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
