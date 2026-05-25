import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const scores = await prisma.score.findMany({
      include: {
        user: {
          select: {
            username: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
      orderBy: {
        points: 'desc',
      },
    });

    const leaderboard = scores.map((score, index) => ({
      rank: index + 1,
      userId: score.userId,
      username: score.user.username || 'Anonymous',
      avatarUrl: score.user.avatarUrl,
      points: score.points,
      breakdown: JSON.parse(score.breakdown),
      updatedAt: score.updatedAt,
    }));

    return NextResponse.json({ leaderboard });
  } catch (error: any) {
    console.error('Error fetching scores:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
