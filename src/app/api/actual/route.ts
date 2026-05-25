import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateScore, TournamentData } from '@/lib/scoring';

export async function GET() {
  try {
    const actual = await prisma.actualResult.findUnique({
      where: { id: 'singleton' },
    });

    if (!actual) {
      return NextResponse.json({ actual: null });
    }

    return NextResponse.json({ actual: JSON.parse(actual.data) });
  } catch (error: any) {
    console.error('Error fetching actual results:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data) {
      return NextResponse.json({ error: 'Missing required field: data' }, { status: 400 });
    }

    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);
    const parsedActual: TournamentData = typeof data === 'string' ? JSON.parse(data) : data;

    // 1. Save actual results
    const actual = await prisma.actualResult.upsert({
      where: { id: 'singleton' },
      update: {
        data: stringifiedData,
      },
      create: {
        id: 'singleton',
        data: stringifiedData,
      },
    });

    // 2. Fetch all predictions
    const predictions = await prisma.prediction.findMany({
      include: {
        user: true,
      },
    });

    const scoreResults = [];

    // 3. For each user prediction, recalculate score
    for (const pred of predictions) {
      try {
        const parsedPred: TournamentData = JSON.parse(pred.data);
        const breakdown = calculateScore(parsedPred, parsedActual);

        const score = await prisma.score.upsert({
          where: { userId: pred.userId },
          update: {
            points: breakdown.total,
            breakdown: JSON.stringify(breakdown),
          },
          create: {
            userId: pred.userId,
            points: breakdown.total,
            breakdown: JSON.stringify(breakdown),
          },
        });

        scoreResults.push({
          userId: pred.userId,
          username: pred.user.username || 'Anonymous',
          points: score.points,
        });
      } catch (err) {
        console.error(`Error calculating score for user ${pred.userId}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      actual: JSON.parse(actual.data),
      recalculatedScores: scoreResults,
    });
  } catch (error: any) {
    console.error('Error saving actual results & scoring:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
