import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, username, avatarUrl, isAdmin } = body;

    if (!id || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { id },
      update: {
        email,
        username,
        avatarUrl,
      },
      create: {
        id,
        email,
        username,
        avatarUrl,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
