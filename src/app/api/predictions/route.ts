import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const prediction = await prisma.prediction.findUnique({
      where: { userId },
    });

    if (!prediction) {
      return NextResponse.json({ prediction: null });
    }

    return NextResponse.json({ prediction: JSON.parse(prediction.data) });
  } catch (error: any) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, data } = body;

    if (!userId || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);

    const prediction = await prisma.prediction.upsert({
      where: { userId },
      update: {
        data: stringifiedData,
      },
      create: {
        userId,
        data: stringifiedData,
      },
    });

    return NextResponse.json({ success: true, prediction: JSON.parse(prediction.data) });
  } catch (error: any) {
    console.error('Error saving predictions:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
