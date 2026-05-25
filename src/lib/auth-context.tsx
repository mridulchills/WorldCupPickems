'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';

interface AppUser {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  isSignedIn: boolean;
  isLoading: boolean;
  isClerkEnabled: boolean;
  loginMock: (username: string, email: string) => void;
  logoutMock: () => void;
  syncUserWithDb: (appUser: AppUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isClerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  const [mockUser, setMockUser] = useState<AppUser | null>(null);
  const [mockLoading, setMockLoading] = useState(true);

  // Clerk hooks (only active if Clerk is enabled)
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = isClerkEnabled 
    ? useUser() 
    : { user: null, isLoaded: true, isSignedIn: false };

  // Sync user with local DB
  const syncUserWithDb = React.useCallback(async (userToSync: AppUser) => {
    try {
      await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userToSync),
      });
    } catch (e) {
      console.error('Failed to sync user with DB:', e);
    }
  }, []);

  useEffect(() => {
    if (!isClerkEnabled) {
      // Mock Auth initialization
      const stored = localStorage.getItem('wc_mock_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setMockUser(parsed);
          syncUserWithDb(parsed);
        } catch {
          localStorage.removeItem('wc_mock_user');
        }
      }
      setMockLoading(false);
    } else if (clerkLoaded && clerkSignedIn && clerkUser) {
      // Sync Clerk user with local DB
      const appUser: AppUser = {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || `${clerkUser.username}@example.com`,
        username: clerkUser.username || clerkUser.firstName || 'User',
        avatarUrl: clerkUser.imageUrl,
        isAdmin: clerkUser.publicMetadata?.isAdmin as boolean || false,
      };
      syncUserWithDb(appUser);
    }
  }, [clerkLoaded, clerkSignedIn, clerkUser, syncUserWithDb]);

  const loginMock = (username: string, email: string) => {
    const formattedUsername = username.trim() || 'Guest';
    const formattedEmail = email.trim() || `${formattedUsername.toLowerCase()}@example.com`;
    const userObj: AppUser = {
      id: `mock_${Date.now()}`,
      email: formattedEmail,
      username: formattedUsername,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${formattedUsername}`,
      isAdmin: formattedUsername.toLowerCase() === 'admin',
    };
    localStorage.setItem('wc_mock_user', JSON.stringify(userObj));
    setMockUser(userObj);
    syncUserWithDb(userObj);
  };

  const logoutMock = () => {
    localStorage.removeItem('wc_mock_user');
    setMockUser(null);
  };

  const value: AuthContextType = {
    user: isClerkEnabled 
      ? (clerkUser ? {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          username: clerkUser.username || clerkUser.firstName || 'User',
          avatarUrl: clerkUser.imageUrl,
          isAdmin: clerkUser.publicMetadata?.isAdmin as boolean || clerkUser.primaryEmailAddress?.emailAddress === 'admin@example.com' || false,
        } : null)
      : mockUser,
    isSignedIn: isClerkEnabled ? !!clerkSignedIn : !!mockUser,
    isLoading: isClerkEnabled ? !clerkLoaded : mockLoading,
    isClerkEnabled,
    loginMock,
    logoutMock,
    syncUserWithDb,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAppAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAppAuth must be used within an AppAuthProvider');
  }
  return context;
}
