'use client';

import React, { useState } from 'react';
import { useAppAuth } from '@/lib/auth-context';
import { UserButton, SignInButton } from '@clerk/nextjs';

export default function Header() {
  const { user, isSignedIn, isClerkEnabled, loginMock, logoutMock } = useAppAuth();
  const [showMockLogin, setShowMockLogin] = useState(false);
  const [mockName, setMockName] = useState('');
  const [mockEmail, setMockEmail] = useState('');

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mockName.trim()) {
      loginMock(mockName, mockEmail);
      setShowMockLogin(false);
      setMockName('');
      setMockEmail('');
    }
  };

  return (
    <header className="header container">
      <div className="header-title-container">
        <div className="header-logo">The 2026 Playbook</div>
        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginTop: '0.25rem', opacity: 0.8 }}>
          FIFA World Cup 2026 Predictor & Pick'ems Simulator
        </p>
      </div>

      <div className="header-meta">
        <div>{today}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isClerkEnabled ? (
            <div>
              {isSignedIn ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.username}</span>
                  <UserButton />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          ) : (
            <div>
              {isSignedIn ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="user-badge">
                    {user?.avatarUrl && (
                      <img src={user.avatarUrl} alt="avatar" className="user-avatar" />
                    )}
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {user?.username} {user?.isAdmin && <span className="score-badge">ADMIN</span>}
                    </span>
                  </div>
                  <button 
                    onClick={logoutMock} 
                    className="btn btn-outline" 
                    style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowMockLogin(true)} 
                  className="btn btn-outline" 
                  style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
                >
                  Enter Simulator
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showMockLogin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="auth-panel" style={{ backgroundColor: 'var(--background-color)', position: 'relative' }}>
            <button 
              onClick={() => setShowMockLogin(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              ×
            </button>
            <h2 className="auth-title">Identify Yourself</h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>
              Set your name to save and score your predictions. Enter &quot;admin&quot; as username for test controls.
            </p>
            <form onSubmit={handleMockSubmit}>
              <div className="auth-form-group">
                <label className="auth-label">Username</label>
                <input 
                  type="text" 
                  className="auth-input" 
                  value={mockName}
                  onChange={(e) => setMockName(e.target.value)}
                  placeholder="e.g. FootballFan42"
                  required
                />
              </div>
              <div className="auth-form-group">
                <label className="auth-label">Email (Optional)</label>
                <input 
                  type="email" 
                  className="auth-input" 
                  value={mockEmail}
                  onChange={(e) => setMockEmail(e.target.value)}
                  placeholder="e.g. fan@example.com"
                />
              </div>
              <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
                Join Pick&apos;ems
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
