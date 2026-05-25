'use client';

import React from 'react';
import { useAppAuth } from '@/lib/auth-context';

interface LeaderboardProps {
  boardData: any[];
  onRefresh: () => void;
}

export default function Leaderboard({ boardData, onRefresh }: LeaderboardProps) {
  const { user } = useAppAuth();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div className="editor-note" style={{ marginBottom: 0 }}>
          Live Leaderboard of all participants. Scores are computed automatically once the editorial staff uploads actual tournament results.
        </div>
        <button onClick={onRefresh} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
          Refresh
        </button>
      </div>

      {boardData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', border: '1px solid var(--border-color)', fontStyle: 'italic', opacity: 0.6 }}>
          No entries have been scored yet. Submit your predictions and wait for the results to populate!
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>Participant</th>
                <th style={{ textAlign: 'center' }}>Groups (Max 240)</th>
                <th style={{ textAlign: 'center' }}>R16 (Max 160)</th>
                <th style={{ textAlign: 'center' }}>QF (Max 160)</th>
                <th style={{ textAlign: 'center' }}>SF (Max 160)</th>
                <th style={{ textAlign: 'center' }}>Podium (Max 700)</th>
                <th style={{ textAlign: 'center', fontWeight: 'bold' }}>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {boardData.map((row) => {
                const isCurrentUser = row.userId === user?.id;
                const breakdown = row.breakdown || {};
                
                // Calculate Podium score: finalists (300) + 3rd place (100) + champion (300) = 700 max
                const podiumScore = (breakdown.finalists || 0) + (breakdown.thirdPlaceWinner || 0) + (breakdown.champion || 0);
                
                return (
                  <tr key={row.userId} style={isCurrentUser ? { backgroundColor: 'var(--bg-muted)', fontWeight: 600 } : {}}>
                    <td style={{ fontWeight: 700 }}>
                      #{row.rank}
                    </td>
                    <td>
                      <div className="user-badge">
                        {row.avatarUrl ? (
                          <img src={row.avatarUrl} alt="avatar" className="user-avatar" />
                        ) : (
                          <div className="user-avatar" style={{ backgroundColor: 'var(--border-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold' }}>
                            {row.username.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span>
                          {row.username} {isCurrentUser && <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>(You)</span>}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{breakdown.groupStandings || 0}</td>
                    <td style={{ textAlign: 'center' }}>{breakdown.r32Progress || 0}</td>
                    <td style={{ textAlign: 'center' }}>{breakdown.r16Progress || 0}</td>
                    <td style={{ textAlign: 'center' }}>{breakdown.r8Progress || 0}</td>
                    <td style={{ textAlign: 'center' }}>{podiumScore}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.05rem' }}>{row.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      <div style={{ marginTop: '2rem', border: '1px solid var(--border-muted)', padding: '1.25rem', fontSize: '0.85rem' }}>
        <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Scoring Rules Reference
        </h4>
        <ul style={{ paddingLeft: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem 1.5rem' }}>
          <li>Group Stage position match: <strong>5 pts</strong></li>
          <li>Group qualification (wrong pos): <strong>2 pts</strong></li>
          <li>Correct Round of 16 qualifier: <strong>10 pts</strong></li>
          <li>Correct Quarter-final qualifier: <strong>20 pts</strong></li>
          <li>Correct Semi-final qualifier: <strong>40 pts</strong></li>
          <li>Correct Finalist: <strong>80 pts</strong></li>
          <li>Correct Third Place: <strong>100 pts</strong></li>
          <li>Correct Champion: <strong>300 pts</strong></li>
        </ul>
      </div>
    </div>
  );
}
