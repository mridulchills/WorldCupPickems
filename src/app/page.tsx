'use client';

import React, { useEffect, useState } from 'react';
import { useAppAuth } from '@/lib/auth-context';
import Header from '@/components/Header';
import GroupsPredictor from '@/components/GroupsPredictor';
import ThirdPlaceSelector from '@/components/ThirdPlaceSelector';
import KnockoutBracket from '@/components/KnockoutBracket';
import Leaderboard from '@/components/Leaderboard';
import AdminPanel from '@/components/AdminPanel';
import { 
  TournamentData, 
  getDefaultTournamentData, 
  calculateScore 
} from '@/lib/scoring';
import { 
  fetchPredictions, 
  savePredictions, 
  fetchActual, 
  fetchLeaderboard 
} from '@/lib/api';

export default function Home() {
  const { user, isSignedIn, isLoading: authLoading } = useAppAuth();
  
  // State variables
  const [activeTab, setActiveTab] = useState<'groups' | 'thirds' | 'bracket' | 'leaderboard' | 'admin'>('groups');
  const [predictions, setPredictions] = useState<TournamentData>(getDefaultTournamentData());
  const [dbPredictions, setDbPredictions] = useState<TournamentData | null>(null);
  
  const [actualResults, setActualResults] = useState<TournamentData>(getDefaultTournamentData());
  const [isActualResultsPublished, setIsActualResultsPublished] = useState(false);
  
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load initial data
  const loadData = async () => {
    setIsDataLoading(true);
    try {
      // 1. Fetch official actual results
      const actual = await fetchActual();
      if (actual) {
        setActualResults(actual);
        setIsActualResultsPublished(true);
      } else {
        setIsActualResultsPublished(false);
      }

      // 2. Fetch Leaderboard
      const board = await fetchLeaderboard();
      setLeaderboard(board);

      // 3. Fetch predictions if user is signed in
      if (user?.id) {
        const pred = await fetchPredictions(user.id);
        if (pred) {
          setPredictions(pred);
          setDbPredictions(pred);
        } else {
          // If no prediction in db, initialize with defaults
          const defaultData = getDefaultTournamentData();
          setPredictions(defaultData);
          setDbPredictions(null);
        }
      }
    } catch (e) {
      console.error('Error loading page data:', e);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [user?.id, authLoading]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = JSON.stringify(predictions) !== JSON.stringify(dbPredictions || getDefaultTournamentData());

  const handleSavePredictions = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    setMessage(null);
    try {
      await savePredictions(user.id, predictions);
      setDbPredictions(predictions);
      setMessage({ text: 'Predictions saved successfully.', type: 'success' });
      // Refresh leaderboard in case user updated
      const board = await fetchLeaderboard();
      setLeaderboard(board);
    } catch (e) {
      setMessage({ text: 'Failed to save predictions. Please try again.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPredictions = () => {
    setPredictions(dbPredictions || getDefaultTournamentData());
    setMessage(null);
  };

  // Compute current user score breakdown if results are published
  const userScoreBreakdown = isActualResultsPublished 
    ? calculateScore(predictions, actualResults) 
    : null;

  return (
    <>
      <Header />
      
      <main className="container" style={{ paddingBottom: '8rem', flex: 1 }}>
        {/* Editorial Subtitle */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', lineHeight: '1.5', fontStyle: 'italic', maxWidth: '800px' }}>
            The 2026 World Cup format features 48 teams competing across North America. Make your pick&apos;ems by ordering group standings, choosing the best wildcards, and charting the full knockout brackets.
          </p>
        </div>

        {/* Global loading state */}
        {(authLoading || isDataLoading) ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.2rem' }}>
            Loading tournament board...
          </div>
        ) : (
          <>
            {/* Active User Score Display */}
            {isSignedIn && userScoreBreakdown && isActualResultsPublished && (
              <div style={{ border: '2px solid var(--border-color)', padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Tournament Score</h3>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Official results are active. Your bracket has been evaluated.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
                    {userScoreBreakdown.total}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Points (Rank #{leaderboard.find(r => r.userId === user?.id)?.rank || '-'})
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="nav-tabs">
              <button 
                onClick={() => setActiveTab('groups')} 
                className={`nav-tab ${activeTab === 'groups' ? 'active' : ''}`}
              >
                Group Stages
              </button>
              <button 
                onClick={() => setActiveTab('thirds')} 
                className={`nav-tab ${activeTab === 'thirds' ? 'active' : ''}`}
              >
                Best 3rd Place
              </button>
              <button 
                onClick={() => setActiveTab('bracket')} 
                className={`nav-tab ${activeTab === 'bracket' ? 'active' : ''}`}
              >
                Knockout Bracket
              </button>
              <button 
                onClick={() => setActiveTab('leaderboard')} 
                className={`nav-tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
              >
                Leaderboard
              </button>
              {user?.isAdmin && (
                <button 
                  onClick={() => setActiveTab('admin')} 
                  className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
                  style={{ border: '1px dashed var(--border-color)' }}
                >
                  Admin Results
                </button>
              )}
            </div>

            {/* Tab Contents */}
            <div>
              {activeTab === 'groups' && (
                <GroupsPredictor 
                  standings={predictions.groupStandings} 
                  onChange={(newStandings) => setPredictions({ ...predictions, groupStandings: newStandings })}
                />
              )}
              
              {activeTab === 'thirds' && (
                <ThirdPlaceSelector 
                  groupStandings={predictions.groupStandings}
                  selectedThirds={predictions.bestThirdPlace}
                  onChange={(newThirds) => setPredictions({ ...predictions, bestThirdPlace: newThirds })}
                />
              )}
              
              {activeTab === 'bracket' && (
                <KnockoutBracket 
                  groupStandings={predictions.groupStandings}
                  bestThirdPlace={predictions.bestThirdPlace}
                  predictions={predictions}
                  onChange={(updatedPred) => setPredictions(updatedPred)}
                />
              )}
              
              {activeTab === 'leaderboard' && (
                <Leaderboard 
                  boardData={leaderboard} 
                  onRefresh={loadData}
                />
              )}

              {activeTab === 'admin' && user?.isAdmin && (
                <AdminPanel 
                  actualData={actualResults} 
                  onChange={(updatedActual) => setActualResults(updatedActual)}
                  onScoringComplete={loadData}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Floating Save Actions Bar */}
      {isSignedIn && hasUnsavedChanges && !authLoading && !isDataLoading && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'var(--foreground-color)',
          color: 'var(--background-color)',
          borderTop: '2px solid var(--border-color)',
          padding: '1.25rem 0',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          zIndex: 900
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 'bold', opacity: 0.8 }}>
                Draft In Progress
              </span>
              <span style={{ fontSize: '0.9rem', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                You have unsaved changes to your World Cup bracket.
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleResetPredictions}
                className="btn btn-outline" 
                style={{ 
                  padding: '0.5rem 1.5rem', 
                  fontSize: '0.8rem',
                  borderColor: 'var(--background-color)',
                  color: 'var(--background-color)'
                }}
              >
                Reset
              </button>
              <button 
                onClick={handleSavePredictions}
                disabled={isSaving}
                className="btn" 
                style={{ 
                  padding: '0.5rem 2rem', 
                  fontSize: '0.8rem',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--foreground-color)',
                  borderColor: 'var(--background-color)'
                }}
              >
                {isSaving ? 'SAVING...' : 'SAVE BRACKET'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Success/Error toast */}
      {message && (
        <div style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '2rem',
          padding: '1rem 1.5rem',
          backgroundColor: message.type === 'success' ? '#000000' : '#d9534f',
          color: '#ffffff',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          zIndex: 950,
          fontSize: '0.85rem',
          fontFamily: 'var(--font-mono)'
        }}>
          {message.text}
        </div>
      )}

      {/* Footer */}
      <footer className="footer container">
        <div>THE 2026 PLAYBOOK — INDEPENDENT JOURNALISM AND WORLD CUP COMPANION</div>
        <div style={{ marginTop: '0.5rem', opacity: 0.5, fontSize: '0.7rem' }}>
          Not affiliated with FIFA or any national soccer federation. All rights reserved.
        </div>
      </footer>
    </>
  );
}
