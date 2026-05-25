import { TournamentData } from './scoring';

export async function fetchPredictions(userId: string): Promise<TournamentData | null> {
  const res = await fetch(`/api/predictions?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch predictions');
  const data = await res.json();
  return data.prediction;
}

export async function savePredictions(userId: string, data: TournamentData): Promise<void> {
  const res = await fetch('/api/predictions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, data }),
  });
  if (!res.ok) throw new Error('Failed to save predictions');
}

export async function fetchActual(): Promise<TournamentData | null> {
  const res = await fetch('/api/actual');
  if (!res.ok) throw new Error('Failed to fetch actual results');
  const data = await res.json();
  return data.actual;
}

export async function saveActual(data: TournamentData): Promise<any> {
  const res = await fetch('/api/actual', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error('Failed to save actual results');
  return await res.json();
}

export async function fetchLeaderboard(): Promise<any[]> {
  const res = await fetch('/api/scores');
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  const data = await res.json();
  return data.leaderboard;
}
