'use client';

import React from 'react';
import { TEAMS, GROUPS, Team } from '@/lib/teams';

interface GroupsPredictorProps {
  standings: Record<string, string[]>; // Group ID -> array of 4 team IDs
  onChange: (newStandings: Record<string, string[]>) => void;
}

export default function GroupsPredictor({ standings, onChange }: GroupsPredictorProps) {
  // Move a team up within its group
  const moveUp = (group: string, index: number) => {
    if (index === 0) return;
    const current = [...(standings[group] || [])];
    const temp = current[index];
    current[index] = current[index - 1];
    current[index - 1] = temp;
    
    onChange({
      ...standings,
      [group]: current
    });
  };

  // Move a team down within its group
  const moveDown = (group: string, index: number) => {
    if (index === 3) return;
    const current = [...(standings[group] || [])];
    const temp = current[index];
    current[index] = current[index + 1];
    current[index + 1] = temp;

    onChange({
      ...standings,
      [group]: current
    });
  };

  return (
    <div>
      <div className="editor-note">
        Note: Use the arrow controls to sort the final group standings. The top two teams (marked Q) will automatically qualify. The third-placed team will advance to the third-place selection pool.
      </div>
      <div className="groups-grid">
        {GROUPS.map(group => {
          const teamIds = standings[group] || [];
          
          return (
            <div key={group} className="group-card">
              <div className="group-header">
                <span>Group {group}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.6 }}>STANDINGS</span>
              </div>
              <div>
                {teamIds.map((teamId, index) => {
                  const team = TEAMS.find(t => t.id === teamId);
                  if (!team) return null;

                  const isQualified = index < 2;
                  const isThird = index === 2;

                  return (
                    <div 
                      key={team.id} 
                      className="team-row"
                      style={{
                        borderLeft: isQualified 
                          ? '3px solid var(--foreground-color)' 
                          : isThird 
                            ? '3px dashed var(--border-color)' 
                            : '3px solid transparent'
                      }}
                    >
                      <div className="team-info">
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, width: '12px' }}>
                          {index + 1}
                        </span>
                        <img 
                          src={`https://flagcdn.com/16x12/${team.code}.png`} 
                          alt={`${team.name} flag`}
                          className="flag-img"
                        />
                        <span className="team-name">{team.name}</span>
                      </div>
                      <div className="team-controls">
                        <button 
                          onClick={() => moveUp(group, index)}
                          className="btn-arrow"
                          disabled={index === 0}
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button 
                          onClick={() => moveDown(group, index)}
                          className="btn-arrow"
                          disabled={index === 3}
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
