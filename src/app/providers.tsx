'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { AppAuthProvider } from '@/lib/auth-context';

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function Providers({ children }: { children: React.ReactNode }) {
  if (clerkPublishableKey) {
    return (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <AppAuthProvider>
          {children}
        </AppAuthProvider>
      </ClerkProvider>
    );
  }

  return (
    <AppAuthProvider>
      {children}
    </AppAuthProvider>
  );
}
