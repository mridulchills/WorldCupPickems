import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextFetchEvent, NextRequest } from 'next/server';

const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const isPublicRoute = createRouteMatcher([
  '/',
  '/api/predictions(.*)',
  '/api/scores(.*)',
  '/api/actual(.*)',
  '/api/users(.*)',
  '/api/sync(.*)'
]);

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!hasClerkKeys) {
    return;
  }
  return clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
  })(req, event);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.[\\w]+$|_next/image|favicon.ico).*)',
    '/(api|trpc)(.*)',
  ],
};
