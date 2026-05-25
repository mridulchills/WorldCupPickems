'use client';

import React, { useState } from 'react';
import { TournamentData } from '@/lib/scoring';
import GroupsPredictor from './GroupsPredictor';
import ThirdPlaceSelector from './ThirdPlaceSelector';
import KnockoutBracket from './KnockoutBracket';
import { saveActual } from '@/lib/api';

interface AdminPanelProps {
  actualData: TournamentData;
  onChange: (updated: TournamentData) => void;
  onScoringComplete: () => void;
}

export default function AdminPanel({ actualData, onChange, onScoringComplete }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'groups' | 'thirds' | 'bracket'>('groups');
  const [isSaving, setIsSaving] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleSave = async () => {
    setIsSaving(true);
    setLogs(['Initiating results publication...', 'Sending official data to database...']);
    try {
      const response = await saveActual(actualData);
      setLogs(prev => [
        ...prev,
        'Official results updated successfully.',
        `Scored ${response.recalculatedScores?.length || 0} user submissions.`,
        'Leaderboard successfully updated.'
      ]);
      onScoringComplete();
    } catch (e: any) {
      setLogs(prev => [...prev, `ERROR: ${e.message || 'Failed to update results'}`]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ border: '2px solid var(--border-color)', padding: '2rem', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Official Results Board
          </h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.25rem' }}>
            Staff portal to set official tournament outcomes and trigger scoring computations.
          </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="btn" 
          style={{ padding: '0.75rem 2rem' }}
        >
          {isSaving ? 'PUBLISHING...' : 'PUBLISH OFFICIAL RESULTS'}
        </button>
      </div>

      {logs.length > 0 && (
        <div style={{ 
          backgroundColor: 'var(--bg-muted)', 
          border: '1px solid var(--border-color)', 
          padding: '1rem', 
          marginBottom: '2rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem'
        }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.25rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            System Terminal
          </div>
          {logs.map((log, i) => (
            <div key={i} style={{ color: log.startsWith('ERROR') ? '#ff0000' : 'inherit' }}>
              &gt; {log}
            </div>
          ))}
        </div>
      )}

      {/* Admin sub-tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('groups')} 
          className={`nav-tab ${activeTab === 'groups' ? 'active' : ''}`}
          style={{ fontSize: '0.75rem' }}
        >
          1. Edit Groups
        </button>
        <button 
          onClick={() => setActiveTab('thirds')} 
          className={`nav-tab ${activeTab === 'thirds' ? 'active' : ''}`}
          style={{ fontSize: '0.75rem' }}
        >
          2. Edit Best 3rds
        </button>
        <button 
          onClick={() => setActiveTab('bracket')} 
          className={`nav-tab ${activeTab === 'bracket' ? 'active' : ''}`}
          style={{ fontSize: '0.75rem' }}
        >
          3. Edit Knockouts
        </button>
      </div>

      <div>
        {activeTab === 'groups' && (
          <GroupsPredictor 
            standings={actualData.groupStandings} 
            onChange={(newStandings) => onChange({ ...actualData, groupStandings: newStandings })}
          />
        )}
        {activeTab === 'thirds' && (
          <ThirdPlaceSelector 
            groupStandings={actualData.groupStandings}
            selectedThirds={actualData.bestThirdPlace}
            onChange={(newThirds) => onChange({ ...actualData, bestThirdPlace: newThirds })}
          />
        )}
        {activeTab === 'bracket' && (
          <KnockoutBracket 
            groupStandings={actualData.groupStandings}
            bestThirdPlace={actualData.bestThirdPlace}
            predictions={actualData}
            onChange={(updatedActual) => onChange(updatedActual)}
          />
        )}
      </div>
    </div>
  );
}
