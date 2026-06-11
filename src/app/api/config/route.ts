import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { id: 'singleton' },
    });
    
    const isEnvLocked = process.env.LOCK_PREDICTIONS === 'true';

    return NextResponse.json({
      picksLocked: isEnvLocked || (config?.picksLocked ?? false),
    });
  } catch (error: any) {
    console.error('Error fetching system config:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { picksLocked } = body;
    
    if (picksLocked === undefined || typeof picksLocked !== 'boolean') {
      return NextResponse.json({ error: 'Missing or invalid picksLocked boolean' }, { status: 400 });
    }

    const config = await prisma.systemConfig.upsert({
      where: { id: 'singleton' },
      update: {
        picksLocked,
      },
      create: {
        id: 'singleton',
        picksLocked,
      },
    });

    return NextResponse.json({ success: true, picksLocked: config.picksLocked });
  } catch (error: any) {
    console.error('Error saving system config:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
